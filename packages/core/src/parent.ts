import {
  deferWhenSameOriginIframeIsLoaded,
  extractIframeOrigin,
  getBoundingRectHeight,
  getDefaultSettings,
  isHtmlIframeElement,
  isIframeSameOrigin,
  removeUndefinedProperties,
} from "~/common";
import { handleLegacyLibResizeMessage, sendLegacyLibInitMessageOnIframeLoad } from "~/compat";
import type { IframeResizeEvent, InitializeFunction, Settings } from "./type";

const resizeObserver = createResizeObserver();
let registeredIframes: Array<{ iframe: HTMLIFrameElement; settings: Settings }> = [];

const initialize: InitializeFunction = (clientSettings, selector) => {
  const finalSettings = { ...getDefaultSettings(), ...removeUndefinedProperties(clientSettings ?? {}) };
  const iframes = resolveIframesToRegister(selector);
  const allowedOrigins = registerIframesAllowOrigins(finalSettings, iframes);

  return iframes.map((iframe) => {
    registeredIframes.push({ iframe, settings: finalSettings });
    const unsubscribeResizeListener = addChildResizeListener(iframe, finalSettings, allowedOrigins);
    return {
      unsubscribe: () => {
        unsubscribeResizeListener();
        registeredIframes = registeredIframes.filter((entry) => entry.iframe !== iframe);
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

function addChildResizeListener(iframe: HTMLIFrameElement, settings: Settings, allowedOrigins: string[]) {
  if (isIframeSameOrigin(iframe)) {
    return addSameOriginChildResizeListener(iframe);
  }
  return addCrossOriginChildResizeListener(iframe, settings, allowedOrigins);
}

function addCrossOriginChildResizeListener(iframe: HTMLIFrameElement, settings: Settings, allowedOrigins: string[]) {
  const handleIframeResizedMessage = (event: MessageEvent) => {
    const isOriginValid = !settings.checkOrigin || allowedOrigins.includes(event.origin);
    const isIframeTarget = iframe.contentWindow === event.source;

    if (!isIframeTarget || !isOriginValid) {
      return;
    }

    if (event.data?.type === "iframe-resized") {
      const { height } = (event as IframeResizeEvent).data;
      height && updateIframeDimensions({ height, iframe, settings });
      return;
    }

    if (settings.enableLegacyLibSupport) {
      const height = handleLegacyLibResizeMessage(event);
      height !== null && updateIframeDimensions({ height, iframe, settings });
      return;
    }
  };

  window.addEventListener("message", handleIframeResizedMessage);

  if (settings.enableLegacyLibSupport) {
    sendLegacyLibInitMessageOnIframeLoad(iframe);
  }

  return () => window.removeEventListener("message", handleIframeResizedMessage);
}

function addSameOriginChildResizeListener(iframe: HTMLIFrameElement) {
  const startListener = () => {
    const contentBody = iframe.contentDocument?.body;
    if (!contentBody) {
      console.error("Unable to observe the iframe content document body");
      return;
    }

    resizeObserver.observe(contentBody);
  };

  deferWhenSameOriginIframeIsLoaded(iframe, startListener);

  return () => {
    if (iframe.contentDocument?.body) {
      resizeObserver.unobserve(iframe.contentDocument.body);
    }
    iframe.removeEventListener("load", startListener);
  };
}

function createResizeObserver() {
  const handleEntry = ({ target }: ResizeObserverEntry) => {
    const matchingRegisteredIframe = registeredIframes.find((value) => value.iframe.contentDocument?.body === target);
    if (!matchingRegisteredIframe) {
      return;
    }
    const { iframe, settings } = matchingRegisteredIframe;
    if (!iframe.contentDocument) {
      return;
    }
    const calculatedHeight = getBoundingRectHeight(iframe.contentDocument);
    if (!calculatedHeight) {
      return;
    }
    updateIframeDimensions({ height: calculatedHeight, iframe, settings });
  };

  return new ResizeObserver((entries) => entries.forEach(handleEntry));
}

function updateIframeDimensions({ height, iframe, settings }: { iframe: HTMLIFrameElement; height: number; settings: Settings }) {
  iframe.style.height = `${height + settings.offsetSize}px`;
}

export { initialize };
