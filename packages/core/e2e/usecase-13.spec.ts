import { expect, test } from "@playwright/test";

test("Should scroll in the parent window when an iframe is resized to keep the iframe in the viewport", async ({ page }) => {
  await page.goto("/usecases/13-update-parent-scroll-on-resize/index.html");
  await expect(page).toHaveScreenshot("01-initial-state.png", { maxDiffPixelRatio: 0.01 });

  await page.locator("#myIframe").contentFrame().getByRole("button", { name: "Add content to the iframe" }).click();
  await expect(page).toHaveScreenshot("02-after-iframe-height-increased.png", { maxDiffPixelRatio: 0.01 });

  await page.locator("#myIframe").contentFrame().getByRole("button", { name: "Shrink the iframe" }).click();
  await expect(page).toHaveScreenshot("03-after-iframe-height-decreased.png", { maxDiffPixelRatio: 0.01 });
});
