import { test } from "@playwright/test";
import { type AssertArg, allIframesOffsetHeightMatch } from "./utils";

test("Should resize iframe when the script is initialized after the iframe is loaded", async ({ page }) => {
  await page.goto("/usecases/08-deferred-initialization/index.html");

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "greaterThan", threshold: 700 });
});
