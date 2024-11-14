import {
  deferWhenSameOriginIframeIsLoaded,
  extractIframeOrigin,
  getBoundingRectHeight,
  getDefaultSettings,
  isBrowser,
  isHtmlIframeElement,
  isIframeSameOrigin,
  removeUndefinedProperties,
} from "~/common";
import { handleLegacyLibResizeMessage, sendLegacyLibInitMessageOnIframeLoad } from "~/compat";
import type { IframeResizeEvent, InitializeFunction, InteractionState, ResizeContext, Settings } from "./type";

type RegisteredElement = { iframe: HTMLIFrameElement; settings: Settings; interactionState: InteractionState };

const resizeObserver: ResizeObserver | null = isBrowser() ? createResizeObserver() : null;
let registeredElements: Array<RegisteredElement> = [];

const initialize: InitializeFunction = (clientSettings, selector) => {
  if (!isBrowser()) {
    return [];
  }
  const finalSettings = { ...getDefaultSettings(), ...removeUndefinedProperties(clientSettings ?? {}) };
  const iframes = resolveIframesToRegister(selector);
  const allowedOrigins = registerIframesAllowOrigins(finalSettings, iframes);

  return iframes.map((iframe) => {
    const registeredElement: RegisteredElement = { iframe, settings: finalSettings, interactionState: { isHovered: false } };
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
  const { iframe, settings } = registeredElement;
  const handleIframeResizedMessage = (event: MessageEvent) => {
    const isOriginValid = !settings.checkOrigin || allowedOrigins.includes(event.origin);
    const isIframeTarget = iframe.contentWindow === event.source;

    if (!isIframeTarget || !isOriginValid) {
      return;
    }

    if (event.data?.type === "iframe-resized") {
      const { height } = (event as IframeResizeEvent).data;
      height && resizeIframe({ newHeight: height, registeredElement });
      return;
    }

    if (settings.enableLegacyLibSupport) {
      const height = handleLegacyLibResizeMessage(event);
      height !== null && resizeIframe({ newHeight: height, registeredElement });
      return;
    }
  };

  window.addEventListener("message", handleIframeResizedMessage);

  if (settings.enableLegacyLibSupport) {
    sendLegacyLibInitMessageOnIframeLoad(iframe);
  }

  return () => window.removeEventListener("message", handleIframeResizedMessage);
}

function addSameOriginChildResizeListener({ iframe }: RegisteredElement) {
  const startListener = () => {
    const contentBody = iframe.contentDocument?.body;
    if (!contentBody) {
      return;
    }
    resizeObserver?.observe(contentBody);
  };

  deferWhenSameOriginIframeIsLoaded(iframe, startListener);

  return () => {
    if (iframe.contentDocument?.body) {
      resizeObserver?.unobserve(iframe.contentDocument.body);
    }
    iframe.removeEventListener("load", startListener);
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

function createResizeObserver() {
  const handleEntry = ({ target }: ResizeObserverEntry) => {
    const matchingRegisteredElement = registeredElements.find((value) => value.iframe.contentDocument?.body === target);
    if (!matchingRegisteredElement) {
      return;
    }
    const { iframe } = matchingRegisteredElement;
    if (!iframe.contentDocument) {
      return;
    }
    const height = getBoundingRectHeight(iframe.contentDocument);
    if (!height) {
      return;
    }
    resizeIframe({ newHeight: height, registeredElement: matchingRegisteredElement });
  };

  return new ResizeObserver((entries) => entries.forEach(handleEntry));
}

function resizeIframe({ registeredElement, newHeight }: { registeredElement: RegisteredElement; newHeight: number }) {
  const { iframe, settings, interactionState } = registeredElement;

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
