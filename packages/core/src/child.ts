import { applyStyleSettings, deferWhenWindowDocumentIsLoaded, getBoundingRectSize, isBrowser, isInIframe, resolveElementToObserve } from "~/common";
import type { IframeChildInitEventData, IframeResizeEventData } from "./type";

const getResizeObserverInstance = createResizerObserverLazyFactory();
let initialized = false;

initializeChildListener();

function initializeChildListener() {
  if (!isBrowser() || !isInIframe()) {
    return;
  }

  window.addEventListener("message", (event: MessageEvent) => {
    if (event.data?.type !== "iframe-child-init") {
      return;
    }

    deferWhenWindowDocumentIsLoaded(() => handleInitializeSignal(event));
  });
}

function handleInitializeSignal(event: MessageEvent<IframeChildInitEventData>) {
  const { targetElementSelector, bodyPadding, bodyMargin } = event.data;
  const elementToObserve = resolveElementToObserve(document, targetElementSelector);

  if (initialized || window.parent !== event.source) {
    return;
  }

  if (!elementToObserve) {
    return setTimeout(() => handleInitializeSignal(event), 500);
  }

  applyStyleSettings(document, { bodyMargin, bodyPadding });

  const resizeObserver = getResizeObserverInstance();
  resizeObserver.disconnect();
  resizeObserver.observe(elementToObserve);
  initialized = true;
}

function createResizerObserverLazyFactory() {
  let resizeObserver: ResizeObserver | null = null;

  return () => {
    if (!resizeObserver) {
      resizeObserver = new ResizeObserver((entries) => {
        if (!entries[0].target) {
          return;
        }
        const { height, width } = getBoundingRectSize(entries[0].target);

        const data: IframeResizeEventData = {
          type: "iframe-resized",
          width,
          height,
        };
        window.parent.postMessage(data, "*");
      });
    }
    return resizeObserver;
  };
}

export { initializeChildListener };
