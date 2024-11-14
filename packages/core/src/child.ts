import { deferWhenWindowIsLoaded, getBoundingRectHeight, isBrowser, isInIframe } from "~/common";
import type { IframeResizeEventData } from "./type";

initializeChildListener();

function initializeChildListener() {
  if (!isBrowser() || !isInIframe()) {
    return;
  }

  deferWhenWindowIsLoaded(window, () => {
    const resizeObserverCallback = () => {
      const data: IframeResizeEventData = {
        type: "iframe-resized",
        width: document.documentElement.scrollWidth,
        height: getBoundingRectHeight(document),
      };
      window.parent.postMessage(data, "*");
    };

    const resizeObserver = new ResizeObserver(resizeObserverCallback);
    resizeObserver.observe(document.body);
  });
}

export { initializeChildListener };
