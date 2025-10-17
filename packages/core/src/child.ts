import {
  applyStyleSettings,
  deferWhenWindowDocumentIsLoaded,
  getBoundingRectSize,
  getExponentialBackoffDelay,
  isBrowser,
  isInIframe,
  resolveElementToObserve,
} from "~/common";
import type { IframeChildInitEventData, IframeGetChildDimensionsEventData, IframeResizeEventData } from "./type";

const getResizeObserverInstance = createResizerObserverLazyFactory();
let initialized = false;
let registeredTargetElementSelector: string | undefined;

initializeChildListener();

function initializeChildListener() {
  if (!isBrowser() || !isInIframe()) {
    return;
  }

  window.addEventListener("message", (event: MessageEvent) => {
    if (event.data?.type === "iframe-child-init") {
      return deferWhenWindowDocumentIsLoaded(() => handleInitializeMessage(event));
    }
    if (event.data?.type === "iframe-get-child-dimensions") {
      return deferWhenWindowDocumentIsLoaded(() => handleGetDimensionsMessage(event));
    }
  });
}

function handleInitializeMessage(event: MessageEvent<IframeChildInitEventData>, nthRetry = 0) {
  const { targetElementSelector, bodyPadding, bodyMargin } = event.data;
  const elementToObserve = resolveElementToObserve(document, targetElementSelector);

  if (initialized || window.parent !== event.source) {
    return;
  }

  if (!elementToObserve) {
    return setTimeout(() => handleInitializeMessage(event, nthRetry + 1), getExponentialBackoffDelay(nthRetry));
  }

  applyStyleSettings(document, { bodyMargin, bodyPadding });
  registeredTargetElementSelector = targetElementSelector;

  const resizeObserver = getResizeObserverInstance();
  resizeObserver.disconnect();
  resizeObserver.observe(elementToObserve);
  initialized = true;
}

function handleGetDimensionsMessage(event: MessageEvent<IframeGetChildDimensionsEventData>) {
  const elementToObserve = resolveElementToObserve(document, registeredTargetElementSelector);

  if (!initialized || window.parent !== event.source || !elementToObserve) {
    return;
  }

  sendIframeResizeMessage(elementToObserve);
}

function createResizerObserverLazyFactory() {
  let resizeObserver: ResizeObserver | null = null;

  return () => {
    if (!resizeObserver) {
      resizeObserver = new ResizeObserver((entries) => {
        if (!entries[0].target) {
          return;
        }

        sendIframeResizeMessage(entries[0].target);
      });
    }
    return resizeObserver;
  };
}

const sendIframeResizeMessage = (element: Element) => {
  const { width, height } = getBoundingRectSize(element);
  const data: IframeResizeEventData = {
    type: "iframe-resized",
    width,
    height,
  };
  window.parent.postMessage(data, "*");
};

export { initializeChildListener };
