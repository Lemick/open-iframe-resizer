import { deferWhenWindowIsLoaded, getBoundingRectHeight, isInIframe } from "~/common";
import type { IframeResizeEventData } from "./type";

if (isInIframe()) {
  initializeChildListener();
}

function initializeChildListener() {
  deferWhenWindowIsLoaded(window, () => {
    const resizeObserverCallback = () => {
      const data: IframeResizeEventData = {
        type: "iframe-resized",
        width: document.documentElement.scrollWidth,
        height: getBoundingRectHeight(document) ?? undefined,
      };
      window.parent.postMessage(data, "*");
    };

    const resizeObserver = new ResizeObserver(resizeObserverCallback);
    resizeObserver.observe(document.body);
  });
}

export { initializeChildListener };
