import { test } from "@playwright/test";
import { type AssertArg, allIframesOffsetHeightMatch } from "./utils";

test("Should resize cross-origin iframe when it is reloaded on navigation", async ({ page }) => {
  await page.goto("/usecases/23-cross-origin-with-navigation/index.html");

  const frameLocator = page.frameLocator("#myIframe");
  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "greaterThan", threshold: 600 });

  await frameLocator.getByRole("link", { name: "Real Navigation" }).click();

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "greaterThan", threshold: 600 });
});
