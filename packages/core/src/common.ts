import type { Settings } from "~/type";

export const isInIframe = () => window && window.self !== window.top;

export const isSameOriginIframe = (iframe: HTMLIFrameElement): iframe is HTMLIFrameElement & { contentDocument: Document } => !!iframe.contentDocument;

export const isHtmlIframeElement = (element: Element): element is HTMLIFrameElement => element instanceof HTMLIFrameElement;

export const deferWhenWindowIsLoaded = (_window: Window, executable: () => void) => {
  _window.document.readyState === "complete" ? executable() : _window.addEventListener("load", executable);
};

/**
 * Post the message twice, it assures the target to receive the message at least once
 */
export const safePostMessageToCrossOriginIframe = (iframe: HTMLIFrameElement, executable: () => void) => {
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
    const iframeSrc = new URL(iframe.src, window.location.origin);
    return iframeSrc.origin === window.location.origin;
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

export const getBoundingRectHeight = (document: Document) => {
  const { height } = document.documentElement.getBoundingClientRect() ?? {};
  return height ? Math.ceil(height) : undefined;
};
