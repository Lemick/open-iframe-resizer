import { expect, test } from "@playwright/test";

test("Should resize the cross origin iframe with a custom target element selector", async ({ page }) => {
  await page.goto("/usecases/15-cross-origin-target-element-selector/index.html");

  await expect(page.locator("#myIframe").contentFrame().getByText("Loading")).toBeVisible();
  await expect(page).toHaveScreenshot("01-loading.png");

  await expect(page.locator("#myIframe").contentFrame().getByText("Loading")).not.toBeVisible();
  await expect(page).toHaveScreenshot("02-loaded.png");
});
