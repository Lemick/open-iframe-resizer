import { test } from "@playwright/test";
import { type AssertArg, allIframesOffsetHeightMatch } from "./utils";

test("Should load lib with ESM and resize iframe", async ({ page }) => {
  await page.goto("/usecases/01-module-load/index.html");

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "greaterThan", threshold: 700 });
});
