import { test } from "@playwright/test";
import { type AssertArg, allIframesOffsetHeightMatch } from "./utils";

test("Should resize iframe when it is reloaded on navigation", async ({ page }) => {
  await page.goto("/usecases/22-iframe-with-navigation/index.html");

  const frameLocator = page.frameLocator("#myIframe");
  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "greaterThan", threshold: 600 });

  await frameLocator.getByRole("link", { name: "Real Navigation" }).click();

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "greaterThan", threshold: 600 });
});
