import { expect, test } from "@playwright/test";

test("Should resize the iframe with a custom target element selector", async ({ page }) => {
  await page.goto("/usecases/14-target-element-selector/index.html");

  await expect(page.locator("#myIframe").contentFrame().getByText("Loading")).toBeVisible();
  await expect(page).toHaveScreenshot("01-loading.png", { maxDiffPixelRatio: 0.01 });

  await expect(page.locator("#myIframe").contentFrame().getByText("Loading")).not.toBeVisible();
  await expect(page).toHaveScreenshot("02-loaded.png", { maxDiffPixelRatio: 0.01 });
});
