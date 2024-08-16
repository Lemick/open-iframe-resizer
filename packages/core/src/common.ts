import type { Settings } from "~/type";

const isInIframe = () => window && window.self !== window.top;

const isSameOriginIframe = (iframe: HTMLIFrameElement): iframe is HTMLIFrameElement & { contentDocument: Document } => !!iframe.contentDocument;

const isHtmlIframeElement = (element: Element): element is HTMLIFrameElement => element instanceof HTMLIFrameElement;

const deferWhenWindowIsLoaded = (_window: Window, executable: () => void) => {
  _window.document.readyState === "complete" ? executable() : _window.addEventListener("load", executable);
};

const deferWhenIframeIsLoaded = (iframe: HTMLIFrameElement, executable: () => void) => {
  const isLoadingCompleted = iframe.contentWindow?.document.readyState === "complete";
  const isNotBlankPage = iframe.src !== "about:blank" && iframe.contentWindow?.location.href !== "about:blank"; // Chrome browsers load once with an empty location

  return isNotBlankPage && isLoadingCompleted ? executable() : iframe.addEventListener("load", executable);
};

const getDefaultSettings: () => Settings = () => ({ offsetSize: 0, checkOrigin: true });

const isIframeSameOrigin = (iframe: HTMLIFrameElement) => {
  try {
    const iframeSrc = new URL(iframe.src, window.location.origin);
    return iframeSrc.origin === window.location.origin;
  } catch (e) {
    return false;
  }
};

export { isInIframe, isSameOriginIframe, isHtmlIframeElement, deferWhenIframeIsLoaded, isIframeSameOrigin, deferWhenWindowIsLoaded, getDefaultSettings };
