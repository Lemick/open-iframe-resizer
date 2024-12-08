import { test } from "@playwright/test";
import { type AssertArg, allIframesOffsetHeightMatch } from "./utils";

test("Should resize iframe from cross-origin when the child iframe only contains the original 'iframe-resizer' child script", async ({ page }) => {
  await page.goto("/usecases/10-cross-origin-iframe-resizer-compat/index.html");

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "greaterThan", threshold: 700 });
});
