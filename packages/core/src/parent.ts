import {
  applyStyleSettings,
  deferWhenSameOriginIframeIsLoaded,
  extractIframeOrigin,
  getBoundingRectSize,
  getDefaultSettings,
  getExponentialBackoffDelay,
  isBrowser,
  isHtmlIframeElement,
  isIframeSameOrigin,
  postMessageSafelyToCrossOriginIframe,
  removeUndefinedProperties,
  resolveElementToObserve,
} from "~/common";
import { getLegacyLibInitMessage, handleLegacyLibResizeMessage } from "~/compat";
import type {
  IframeChildInitEventData,
  IframeGetChildDimensionsEventData,
  IframeResizeEvent,
  InitializeFunction,
  RegisteredElement,
  ResizeContext,
  Settings,
} from "./type";

const getResizeObserverInstance = createResizerObserverLazyFactory();
let registeredElements: Array<RegisteredElement> = [];

const initialize: InitializeFunction = async (clientSettings, selector) => {
  if (!isBrowser()) {
    return [];
  }
  const finalSettings = { ...getDefaultSettings(), ...removeUndefinedProperties(clientSettings ?? {}) };
  const iframes = resolveIframesToRegister(selector);
  const allowedOrigins = registerIframesAllowOrigins(finalSettings, iframes);

  return Promise.all(
    iframes.map(async (iframe) => {
      const registeredElement: RegisteredElement = {
        iframe,
        settings: finalSettings,
        interactionState: { isHovered: false },
        initContext: { isInitialized: false, retryAttempts: 0 },
      };
      const { unsubscribe, resize } = await addChildResizeListener(registeredElement, allowedOrigins);
      registeredElements.push(registeredElement);

      return {
        unsubscribe: () => {
          unsubscribe();
          registeredElements = registeredElements.filter((entry) => entry.iframe !== iframe);
        },
        resize,
      };
    }),
  );
};

function resolveIframesToRegister(selector?: string | HTMLIFrameElement): HTMLIFrameElement[] {
  if (typeof selector === "string") {
    return Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(isHtmlIframeElement);
  }
  if (selector) {
    return isHtmlIframeElement(selector) ? [selector] : [];
  }
  return Array.from(document.getElementsByTagName("iframe"));
}

function registerIframesAllowOrigins(settings: Settings, iframes: HTMLIFrameElement[]) {
  if (Array.isArray(settings.checkOrigin)) {
    return settings.checkOrigin;
  }

  if (!settings.checkOrigin) {
    return [];
  }

  const allowedOrigins: string[] = [];
  for (const iframe of iframes) {
    const origin = extractIframeOrigin(iframe);
    if (origin) {
      allowedOrigins.push(origin);
    }
  }
  return allowedOrigins;
}

async function addChildResizeListener(registeredElement: RegisteredElement, allowedOrigins: string[]) {
  const isSameOrigin = await isIframeSameOrigin(registeredElement.iframe);

  const { unsubscribe, resize } = isSameOrigin
    ? addSameOriginChildResizeListener(registeredElement)
    : addCrossOriginChildResizeListener(registeredElement, allowedOrigins);

  const removeInteractionListeners = addInteractionListeners(registeredElement);

  return {
    unsubscribe: () => {
      unsubscribe();
      removeInteractionListeners();
    },
    resize,
  };
}

function addCrossOriginChildResizeListener(registeredElement: RegisteredElement, allowedOrigins: string[]) {
  const {
    iframe,
    initContext,
    settings: { checkOrigin, enableLegacyLibSupport, targetElementSelector, bodyPadding, bodyMargin },
  } = registeredElement;

  const handleIframeResizedMessage = (event: MessageEvent) => {
    const eventOriginObfuscated = event.origin === "null";
    const isOriginValid = !checkOrigin || eventOriginObfuscated || allowedOrigins.includes(event.origin);
    const isIframeTarget = iframe.contentWindow === event.source;

    if (!isIframeTarget || !isOriginValid) {
      return;
    }

    if (event.data?.type === "iframe-resized") {
      const { height } = (event as IframeResizeEvent).data;
      height && applyMeasuredIframeResize({ newHeight: height, registeredElement });
      return;
    }

    if (enableLegacyLibSupport) {
      const height = handleLegacyLibResizeMessage(event);
      height !== null && applyMeasuredIframeResize({ newHeight: height, registeredElement });
      return;
    }
  };

  window.addEventListener("message", handleIframeResizedMessage);

  const initMessage: string | IframeChildInitEventData = enableLegacyLibSupport
    ? getLegacyLibInitMessage()
    : { type: "iframe-child-init", targetElementSelector, bodyPadding, bodyMargin };

  const sendInitializationMessageToChild = () => {
    postMessageSafelyToCrossOriginIframe(iframe, () => iframe.contentWindow?.postMessage(initMessage, "*"));
    initContext.retryAttempts++;
    initContext.retryTimeoutId = window.setTimeout(sendInitializationMessageToChild, getExponentialBackoffDelay(initContext.retryAttempts));
  };

  sendInitializationMessageToChild();

  return {
    unsubscribe: () => window.removeEventListener("message", handleIframeResizedMessage),
    resize: () => {
      const message: IframeGetChildDimensionsEventData = { type: "iframe-get-child-dimensions" };
      iframe.contentWindow?.postMessage(message, "*");
    },
  };
}

function addSameOriginChildResizeListener(registeredElement: RegisteredElement) {
  const { iframe, settings } = registeredElement;
  const { targetElementSelector } = settings;
  let nthRetry = 0;

  const initialize = () => {
    const elementToObserve = resolveElementToObserve(iframe.contentDocument, targetElementSelector);

    if (!iframe.contentDocument || !elementToObserve) {
      nthRetry++;
      return setTimeout(initialize, getExponentialBackoffDelay(nthRetry));
    }

    applyStyleSettings(iframe.contentDocument, settings);
    getResizeObserverInstance().observe(elementToObserve);
  };

  deferWhenSameOriginIframeIsLoaded(iframe, initialize);

  return {
    unsubscribe: () => {
      const elementToObserve = resolveElementToObserve(iframe.contentDocument, targetElementSelector);
      if (elementToObserve) {
        getResizeObserverInstance().unobserve(elementToObserve);
      }
    },
    resize: () => measureAndResizeIframe(registeredElement)
  };
}

function addInteractionListeners({ iframe, interactionState, settings }: RegisteredElement) {
  if (!settings.onBeforeIframeResize && !settings.onIframeResize) {
    return () => {};
  }

  const onMouseEnter = () => {
    interactionState.isHovered = true;
  };

  const onMouseLeave = () => {
    interactionState.isHovered = false;
  };

  iframe.addEventListener("mouseenter", onMouseEnter);
  iframe.addEventListener("mouseleave", onMouseLeave);

  return () => {
    iframe.removeEventListener("mouseenter", onMouseEnter);
    iframe.removeEventListener("mouseleave", onMouseLeave);
  };
}

function createResizerObserverLazyFactory() {
  let resizeObserver: ResizeObserver | null = null;

  return () => {
    if (!resizeObserver) {
      const handleEntry = ({ target }: ResizeObserverEntry) => {
        const matchingRegisteredElement = registeredElements.find(({ iframe }) => iframe.contentDocument === target.ownerDocument);
        if (matchingRegisteredElement) {
          measureAndResizeIframe(matchingRegisteredElement);
        }
      };

      resizeObserver = new ResizeObserver((entries) => entries.forEach(handleEntry));
    }

    return resizeObserver;
  };
}

function measureAndResizeIframe(registeredElement: RegisteredElement) {
  const  { iframe, settings } = registeredElement;
  const observedElement = resolveElementToObserve(iframe.contentDocument, settings.targetElementSelector);
  if (!observedElement) {
    return;
  }

  const { height } = getBoundingRectSize(observedElement);
  if (!height) {
    return;
  }

  applyMeasuredIframeResize({ newHeight: height, registeredElement });
}

function applyMeasuredIframeResize({ registeredElement, newHeight }: { registeredElement: RegisteredElement; newHeight: number }) {
  const { iframe, settings, interactionState, initContext } = registeredElement;

  if (!initContext.isInitialized) {
    initContext.isInitialized = true;
    clearTimeout(initContext.retryTimeoutId);
  }

  if (settings.onBeforeIframeResize?.({ iframe, interactionState: { ...interactionState }, settings: { ...settings }, observedHeight: newHeight }) === false) {
    return;
  }

  const previousBoundingRect = iframe.getBoundingClientRect();
  const newCalculatedHeight = newHeight + settings.offsetSize;
  iframe.style.height = `${newCalculatedHeight}px`;

  if (!settings.onIframeResize) {
    return;
  }

  const resizeContext: ResizeContext = {
    iframe,
    settings: { ...settings },
    interactionState: { ...interactionState },
    previousRenderState: { rect: previousBoundingRect },
    nextRenderState: { rect: iframe.getBoundingClientRect() },
  };
  settings.onIframeResize(resizeContext);
}

export { initialize };
