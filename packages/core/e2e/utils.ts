export type AssertArg = { comparator: "greaterThan" | "lesserThan"; threshold: number };

export const allIframesOffsetHeightMatch = ({ threshold, comparator }: AssertArg) => {
  if (!window.document || window.document.getElementsByTagName("iframe").length === 0) {
    return false;
  }
  const children = [...window.document.getElementsByTagName("iframe")];
  return children.every((iframe: HTMLIFrameElement) => (comparator === "greaterThan" ? iframe.offsetHeight > threshold : iframe.offsetHeight < threshold));
};
