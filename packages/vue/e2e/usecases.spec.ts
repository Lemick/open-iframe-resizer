import { test } from "@playwright/test";

const allIframesHasBeenResized = () => {
  if (!window.document || window.document.getElementsByTagName("iframe").length === 0) {
    return false;
  }
  const children = [...window.document.getElementsByTagName("iframe")];
  return children.every((iframe) => iframe.offsetHeight > 2500);
};

test("Should resize an Iframe with the Vue component", async ({ page }) => {
  await page.goto("/usecases/01-module-load/index.html");

  await page.waitForFunction(allIframesHasBeenResized);
});

test("Should resize an Iframe with the Vue with cross origin iframes", async ({ page }) => {
  await page.goto("/usecases/02-cross-origin-iframe/index.html");

  await page.waitForFunction(allIframesHasBeenResized);
});
