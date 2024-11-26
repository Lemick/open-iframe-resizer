import { deferWhenWindowDocumentIsLoaded, getBoundingRectSize, isBrowser, isInIframe, resolveElementToObserve } from "~/common";
import type { IframeChildInitEventData, IframeResizeEventData } from "./type";

initializeChildListener();

const resizeObserver: ResizeObserver | null = isBrowser() ? createResizeObserver() : null;
let initialized = false;

function initializeChildListener() {
  if (!isBrowser() || !isInIframe()) {
    return;
  }

  window.addEventListener("message", (event: MessageEvent) => {
    if (event.data?.type === "iframe-child-init") {
      deferWhenWindowDocumentIsLoaded(() => handleInitializeSignal(event));
    }
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

  if (bodyPadding) {
    document.body.style.padding = bodyPadding;
  }

  if (bodyMargin) {
    document.body.style.margin = bodyMargin;
  }

  resizeObserver?.disconnect();
  resizeObserver?.observe(elementToObserve);
  initialized = true;
}

function createResizeObserver() {
  return new ResizeObserver((entries) => {
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

export { initializeChildListener };
