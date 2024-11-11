import { expect, test } from "@playwright/test";

type AssertArg = { comparator: "greaterThan" | "lesserThan"; threshold: number };

const allIframesOffsetHeightMatch = ({ threshold, comparator }: AssertArg) => {
  if (!window.document || window.document.getElementsByTagName("iframe").length === 0) {
    return false;
  }
  const children = [...window.document.getElementsByTagName("iframe")];
  return children.every((iframe: HTMLIFrameElement) => (comparator === "greaterThan" ? iframe.offsetHeight > threshold : iframe.offsetHeight < threshold));
};

test("Should load lib with ESM and resize iframe", async ({ page }) => {
  await page.goto("/usecases/01-module-load/index.html");

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "greaterThan", threshold: 700 });
});

test(" Should load lib with UMD and resize iframe", async ({ page }) => {
  await page.goto("/usecases/02-umd-load/index.html");

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "greaterThan", threshold: 700 });
});

test("Should resize multiples iframes", async ({ page }) => {
  await page.goto("/usecases/03-multiple-iframes/index.html");

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "greaterThan", threshold: 700 });
});

test("Should resize nested iframes", async ({ page }) => {
  await page.goto("/usecases/04-nested-iframes/index.html");

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "greaterThan", threshold: 700 });
});

test("Should resize iframe from a different-origin", async ({ page }) => {
  await page.goto("/usecases/05-cross-origin/index.html");

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "greaterThan", threshold: 700 });
});

test("Should resize iframe from a different-origin with custom allowed origin", async ({ page }) => {
  await page.goto("/usecases/07-custom-allowed-origins/index.html");

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "greaterThan", threshold: 700 });
});

test("Should resize iframe when the script is initialized after the iframe is loaded", async ({ page }) => {
  await page.goto("/usecases/08-deferred-initialization/index.html");

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "greaterThan", threshold: 700 });
});

test("Should resize iframe from cross-origin when the iframe take a lot of time to load the script", async ({ page }) => {
  await page.goto("/usecases/09-cross-origin-deferred-initialization/index.html");

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "greaterThan", threshold: 700 });
});

test("Should resize iframe from cross-origin when the child iframe only contains the original 'iframe-resizer' child script", async ({ page }) => {
  await page.goto("/usecases/10-cross-origin-iframe-resizer-compat/index.html");

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "greaterThan", threshold: 700 });
});

test("Should resize iframe whether it shrinks or grows", async ({ page }) => {
  await page.goto("/usecases/11-grow-then-shrink/index.html");

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "greaterThan", threshold: 700 });

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "lesserThan", threshold: 700 });
});

test("Should not resize iframe when unsubscribed", async ({ page }) => {
  await page.goto("/usecases/12-unsubscribe-listener/index.html");

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "lesserThan", threshold: 700 });
});

test("Should scroll in the parent window when an iframe is resized to keep the iframe in the viewport", async ({ page }) => {
  await page.goto("/usecases/13-update-parent-scroll-on-resize/index.html");
  await expect(page).toHaveScreenshot("01-initial-state.png");

  await page.locator("#myIframe").contentFrame().getByRole("button", { name: "Add content to the iframe" }).click();
  await expect(page).toHaveScreenshot("02-after-iframe-height-increased.png");

  await page.locator("#myIframe").contentFrame().getByRole("button", { name: "Shrink the iframe" }).click();
  await expect(page).toHaveScreenshot("03-after-iframe-height-decreased.png");
});
