// Backward compatibility with iframe-resizer lib

export const getLegacyLibInitMessage = () => "[iFrameSizer]ID:0:false:false:32:true:true::auto:::0:false:child:auto:true:::true:::false";

export function handleLegacyLibResizeMessage(event: MessageEvent): number | null {
  if (typeof event.data !== "string" || !event.data.startsWith("[iFrameSizer]")) {
    return null;
  }

  // newer versions also append the child's version number on the init event
  if (
    !(event.data.search(/:init(:[\d.]+)?$/g) >= 0) &&
    !event.data.endsWith("mutationObserver") && !event.data.endsWith("resizeObserver")
  ) {
    return null;
  }

  const [_, heightStr] = event.data.split(":");
  const height = +heightStr;
  return height > 0 ? height : null;
}
