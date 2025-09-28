import { describe, expect, it } from "vitest";
import { isIframeSameOrigin } from "../src/common";

const triggerLoad = (iframe: HTMLIFrameElement) => {
  const event = new Event("load");
  iframe.dispatchEvent(event);
};

describe("isIframeSameOriginAsync", () => {
  it("resolves true when contentDocument is accessible and src is not about:blank", async () => {
    const iframe = document.createElement("iframe");
    iframe.src = "https://example.com";
    Object.defineProperty(iframe, "contentDocument", {
      value: { URL: "https://example.com" },
      configurable: true,
    });

    const result = await isIframeSameOrigin(iframe);

    expect(result).toBe(true);
  });

  it("resolves false when accessing contentDocument throws (cross-origin)", async () => {
    const iframe = document.createElement("iframe");
    iframe.src = "https://cross-origin.com";

    Object.defineProperty(iframe, "contentDocument", {
      get() {
        throw new Error("Blocked");
      },
    });

    const result = await isIframeSameOrigin(iframe);

    expect(result).toBe(false);
  });

  it("waits for load event when contentDocument.URL is about:blank", async () => {
    const iframe = document.createElement("iframe");
    iframe.src = "about:blank";

    Object.defineProperty(iframe, "contentDocument", {
      value: { URL: "about:blank" },
      configurable: true,
    });

    const promise = isIframeSameOrigin(iframe);

    Object.defineProperty(iframe, "contentDocument", {
      value: { URL: "https://same-origin.com" },
      configurable: true,
    });

    triggerLoad(iframe);
    const result = await promise;

    expect(result).toBe(true);
  });
});
