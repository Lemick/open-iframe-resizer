import type { Settings } from "~/type";

export const isBrowser = () => typeof window !== "undefined";

export const isInIframe = () => window.self !== window.top;

export const isHtmlIframeElement = (element: Element): element is HTMLIFrameElement => element instanceof HTMLIFrameElement;

export const deferWhenWindowDocumentIsLoaded = (executable: () => void) => {
  window.document.readyState === "complete" ? executable() : window.addEventListener("load", executable);
};

/**
 * Post the message twice, it assures the target to receive the message at least once
 */
export const postMessageSafelyToCrossOriginIframe = (iframe: HTMLIFrameElement, executable: () => void) => {
  executable();
  iframe.addEventListener("load", executable);
};

export const deferWhenSameOriginIframeIsLoaded = (iframe: HTMLIFrameElement, executable: () => void) => {
  const isLoadingCompleted = iframe.contentWindow?.document.readyState === "complete";
  const isNotBlankPage = iframe.src !== "about:blank" && iframe.contentWindow?.location.href !== "about:blank"; // Chrome browsers load once with an empty location

  return isNotBlankPage && isLoadingCompleted ? executable() : iframe.addEventListener("load", executable);
};

export const getDefaultSettings: () => Settings = () => ({ offsetSize: 0, checkOrigin: true, enableLegacyLibSupport: false });

export const isIframeSameOrigin = (iframe: HTMLIFrameElement) => {
  try {
    return new URL(iframe.src).origin === window.location.origin;
  } catch (e) {
    return false;
  }
};

export const extractIframeOrigin = (iframe: HTMLIFrameElement): string | null => {
  try {
    const origin = new URL(iframe.src).origin;
    if (origin !== "about:blank") {
      return origin;
    }
  } catch (error) {}
  return null;
};

export const removeUndefinedProperties = <T extends { [key: string]: unknown }>(object: T): T => {
  Object.keys(object).forEach((key) => object[key] === undefined && delete object[key]);
  return object;
};

export const getBoundingRectSize = (element: Element) => {
  const { height, width } = element.getBoundingClientRect();
  return { height: Math.ceil(height), width: Math.ceil(width) };
};

export const resolveElementToObserve = (document: Document | null, targetElementSelector?: string) => {
  if (!document) {
    return null;
  }
  return targetElementSelector ? document.querySelector(targetElementSelector) : document.documentElement;
};

export const applyStyleSettings = (document: Document, styleSettings: { bodyMargin?: string; bodyPadding?: string }) => {
  if (!document) {
    return;
  }

  if (styleSettings.bodyPadding) {
    document.body.style.padding = styleSettings.bodyPadding;
  }

  if (styleSettings.bodyMargin) {
    document.body.style.margin = styleSettings.bodyMargin;
  }
};

export const getExponentialBackoffDelay = (nthRetry: number) => {
  if (nthRetry <= 100) {
    return 100; // for 10 seconds
  }

  if (nthRetry <= 120) {
    return 1000; // for 20 seconds
  }

  return 10000;
};
