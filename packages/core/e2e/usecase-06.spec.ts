import { expect, test } from "@playwright/test";

test("Should resize iframe with by adding an offsetSize", async ({ page }) => {
  await page.goto("/usecases/06-offset-height/index.html");

  await expect(page.locator("#myIframe").contentFrame().getByText("Loading")).not.toBeVisible();
  await expect(page).toHaveScreenshot("01-loaded.png", { maxDiffPixelRatio: 0.01 });
});
