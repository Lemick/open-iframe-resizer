import { expect, test } from "@playwright/test";

test("Should apply style on the cross origin iframe with a custom target element selector", async ({ page }) => {
  await page.goto("/usecases/17-cross-origin-custom-padding-margin/index.html");

  await expect(page.locator("#myIframe").contentFrame().getByText("Loaded")).toBeVisible();
  await expect(page).toHaveScreenshot("01-loaded.png");
});
