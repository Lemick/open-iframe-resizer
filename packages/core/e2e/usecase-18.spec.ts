import { test } from "@playwright/test";
import { allIframesOffsetHeightMatch, type AssertArg } from "./utils";

test("Should resize according to onBeforeResize handler (while height is lesser than 2000px)", async ({ page }) => {
  await page.goto("/usecases/18-on-before-resize-handler/index.html");

  await page.waitForTimeout(1000); // Wait for the content to be added

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "greaterThan", threshold: 1000 });

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "lesserThan", threshold: 2000 });
});
