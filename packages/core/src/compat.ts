// Backward compatibility with iframe-resizer lib

export const getLegacyLibInitMessage = () => "[iFrameSizer]ID:0:false:false:32:true:true::auto:::0:false:child:auto:true:::true:::false";

export function handleLegacyLibResizeMessage(event: MessageEvent): number | null {
  if (typeof event.data === "string" && event.data.startsWith("[iFrameSizer]")) {
    const [_, heightStr] = event.data.split(":");
    const height = +heightStr;
    return height > 0 ? height : null;
  }
  return null;
}
