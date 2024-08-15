import { isInIframe } from "~/common";
import type { IframeResizeEventData } from "./type";

if (isInIframe()) {
  initializeChildListener();
}

function initializeChildListener() {
  window.addEventListener("load", () => {
    const resizeObserverCallback = () => {
      const data: IframeResizeEventData = {
        type: "iframe-resized",
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      };
      window.parent.postMessage(data, "*");
    };

    const resizeObserver = new ResizeObserver(resizeObserverCallback);
    resizeObserver.observe(document.body);
  });
}

export { initializeChildListener };
