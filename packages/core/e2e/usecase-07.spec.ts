import { test } from "@playwright/test";
import { type AssertArg, allIframesOffsetHeightMatch } from "./utils";

test("Should resize iframe from a different-origin with custom allowed origin", async ({ page }) => {
  await page.goto("/usecases/07-custom-allowed-origins/index.html");

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "greaterThan", threshold: 700 });
});
