import {
  applyStyleSettings,
  deferWhenSameOriginIframeIsLoaded,
  extractIframeOrigin,
  getBoundingRectSize,
  getDefaultSettings,
  isBrowser,
  isHtmlIframeElement,
  isIframeSameOrigin,
  postMessageSafelyToCrossOriginIframe,
  removeUndefinedProperties,
  resolveElementToObserve,
} from "~/common";
import { getLegacyLibInitMessage, handleLegacyLibResizeMessage } from "~/compat";
import type { IframeChildInitEventData, IframeResizeEvent, InitializeFunction, RegisteredElement, ResizeContext, Settings } from "./type";

const getResizeObserverInstance = createResizerObserverLazyFactory();
let registeredElements: Array<RegisteredElement> = [];

const initialize: InitializeFunction = (clientSettings, selector) => {
  if (!isBrowser()) {
    return [];
  }
  const finalSettings = { ...getDefaultSettings(), ...removeUndefinedProperties(clientSettings ?? {}) };
  const iframes = resolveIframesToRegister(selector);
  const allowedOrigins = registerIframesAllowOrigins(finalSettings, iframes);

  return iframes.map((iframe) => {
    const registeredElement: RegisteredElement = {
      iframe,
      settings: finalSettings,
      interactionState: { isHovered: false },
      initContext: { hasReceivedResizedMessage: false, retryAttempts: 0 },
    };
    const unsubscribe = addChildResizeListener(registeredElement, allowedOrigins);
    registeredElements.push(registeredElement);

    return {
      unsubscribe: () => {
        unsubscribe();
        registeredElements = registeredElements.filter((entry) => entry.iframe !== iframe);
      },
    };
  });
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

function addChildResizeListener(registeredElement: RegisteredElement, allowedOrigins: string[]) {
  const removeResizeListener = isIframeSameOrigin(registeredElement.iframe)
    ? addSameOriginChildResizeListener(registeredElement)
    : addCrossOriginChildResizeListener(registeredElement, allowedOrigins);

  const removeInteractionListeners = addInteractionListeners(registeredElement);

  return () => {
    removeResizeListener();
    removeInteractionListeners();
  };
}

function addCrossOriginChildResizeListener(registeredElement: RegisteredElement, allowedOrigins: string[]) {
  const {
    iframe,
    initContext,
    settings: { checkOrigin, enableLegacyLibSupport, targetElementSelector, bodyPadding, bodyMargin },
  } = registeredElement;

  const handleIframeResizedMessage = (event: MessageEvent) => {
    const isOriginValid = !checkOrigin || allowedOrigins.includes(event.origin);
    const isIframeTarget = iframe.contentWindow === event.source;

    if (!isIframeTarget || !isOriginValid) {
      return;
    }

    if (event.data?.type === "iframe-resized") {
      const { height } = (event as IframeResizeEvent).data;
      height && resizeIframe({ newHeight: height, registeredElement });
      return;
    }

    if (enableLegacyLibSupport) {
      const height = handleLegacyLibResizeMessage(event);
      height !== null && resizeIframe({ newHeight: height, registeredElement });
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
    initContext.retryTimeoutId = window.setTimeout(sendInitializationMessageToChild, calculateNextRetryDelay(initContext.retryAttempts));
  };

  sendInitializationMessageToChild();

  return () => window.removeEventListener("message", handleIframeResizedMessage);
}

function addSameOriginChildResizeListener(registeredElement: RegisteredElement) {
  const { iframe, settings } = registeredElement;
  const { targetElementSelector } = settings;

  const initialize = () => {
    const elementToObserve = resolveElementToObserve(iframe.contentDocument, targetElementSelector);

    if (!iframe.contentDocument || !elementToObserve) {
      return setTimeout(initialize, 500);
    }

    applyStyleSettings(iframe.contentDocument, settings);
    getResizeObserverInstance().observe(elementToObserve);
  };

  deferWhenSameOriginIframeIsLoaded(iframe, initialize);

  return () => {
    const elementToObserve = resolveElementToObserve(iframe.contentDocument, targetElementSelector);
    if (elementToObserve) {
      getResizeObserverInstance().unobserve(elementToObserve);
    }
    iframe.removeEventListener("load", initialize);
  };
}

function addInteractionListeners({ iframe, interactionState }: RegisteredElement) {
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
        if (!matchingRegisteredElement) {
          return;
        }

        const { iframe, settings } = matchingRegisteredElement;
        const observedElement = resolveElementToObserve(iframe.contentDocument, settings.targetElementSelector);
        if (!observedElement) {
          return;
        }

        const { height } = getBoundingRectSize(observedElement);
        if (!height) {
          return;
        }
        resizeIframe({ newHeight: height, registeredElement: matchingRegisteredElement });
      };

      resizeObserver = new ResizeObserver((entries) => entries.forEach(handleEntry));
    }

    return resizeObserver;
  };
}

function resizeIframe({ registeredElement, newHeight }: { registeredElement: RegisteredElement; newHeight: number }) {
  const { iframe, settings, interactionState, initContext } = registeredElement;

  if (!initContext.hasReceivedResizedMessage) {
    initContext.hasReceivedResizedMessage = true;
    clearTimeout(initContext.retryTimeoutId);
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

function calculateNextRetryDelay(nthRetry: number) {
  if (nthRetry <= 100) {
    return 40; // 40 ms for 4 seconds
  }

  if (nthRetry <= 160) {
    return 100; // 100 ms for 6 seconds
  }

  return 1000;
}

export { initialize };
