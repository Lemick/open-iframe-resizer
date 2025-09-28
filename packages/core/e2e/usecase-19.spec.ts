import { test } from "@playwright/test";
import { type AssertArg, allIframesOffsetHeightMatch } from "./utils";

test("Should resize in cross origin mode when same origin iframe is sandboxed", async ({ page }) => {
  await page.goto("/usecases/19-same-origin-sandbox/index.html");

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "greaterThan", threshold: 1000 });
});
