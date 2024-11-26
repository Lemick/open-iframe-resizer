import { test } from "@playwright/test";
import { type AssertArg, allIframesOffsetHeightMatch } from "./utils";

test("Should resize nested iframes", async ({ page }) => {
  await page.goto("/usecases/04-nested-iframes/index.html");

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "greaterThan", threshold: 700 });
});
