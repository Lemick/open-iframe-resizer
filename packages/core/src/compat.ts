// Backward compatibility with iframe-resizer lib

import { extractIframeOrigin, safePostMessageToCrossOriginIframe } from "~/common";

export function sendLegacyLibInitMessageOnIframeLoad(iframe: HTMLIFrameElement) {
  safePostMessageToCrossOriginIframe(iframe, () =>
    iframe.contentWindow?.postMessage(
      "[iFrameSizer]ID:0:false:false:32:true:true::auto:::0:false:child:auto:true:::true:::false",
      extractIframeOrigin(iframe) ?? "*",
    ),
  );
}

export function handleLegacyLibResizeMessage(event: MessageEvent): number | null {
  if (typeof event.data === "string" && event.data.startsWith("[iFrameSizer]")) {
    const [_, height] = event.data.split(":");
    return +height;
  }
  return null;
}
