import { test } from "@playwright/test";
import { type AssertArg, allIframesOffsetHeightMatch } from "./utils";

test("Should resize iframe from cross-origin when the iframe take a lot of time to load the child script", async ({ page }) => {
  await page.goto("/usecases/09-cross-origin-deferred-initialization/index.html");

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "greaterThan", threshold: 700 });
});
