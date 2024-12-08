import { test } from "@playwright/test";
import { type AssertArg, allIframesOffsetHeightMatch } from "./utils";

test("Should resize iframe whether it shrinks or grows", async ({ page }) => {
  await page.goto("/usecases/11-grow-then-shrink/index.html");

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "greaterThan", threshold: 700 });

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "lesserThan", threshold: 700 });
});
