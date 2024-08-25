import { test } from "@playwright/test";

const allIframesHasBeenResized = () => {
  if (!window.document || window.document.getElementsByTagName("iframe").length === 0) {
    return false;
  }
  const children = [...window.document.getElementsByTagName("iframe")];
  return children.every((iframe) => iframe.offsetHeight > 700);
};

test("Should resize an Iframe with the React component", async ({ page }) => {
  await page.goto("/usecases/01-module-load/index.html");

  await page.getByRole("button", { name: "Mount IFrame" }).click();
  await page.waitForFunction(allIframesHasBeenResized);
});

test("Should resize an Iframe with the React component when the child iframe only contains the original 'iframe-resizer' child script", async ({ page }) => {
  await page.goto("/usecases/02-cross-origin-iframe-resizer-compat/index.html");

  await page.getByRole("button", { name: "Mount IFrame" }).click();
  await page.waitForFunction(allIframesHasBeenResized);
});

test("Should resize an Iframe with the React component with a cross origin child", async ({ page }) => {
  await page.goto("/usecases/03-cross-origin-iframe/index.html");

  await page.getByRole("button", { name: "Mount IFrame" }).click();
  await page.waitForFunction(allIframesHasBeenResized);
});
