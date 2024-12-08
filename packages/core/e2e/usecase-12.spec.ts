import { test } from "@playwright/test";
import { type AssertArg, allIframesOffsetHeightMatch } from "./utils";

test("Should not resize iframe when unsubscribed", async ({ page }) => {
  await page.goto("/usecases/12-unsubscribe-listener/index.html");

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "lesserThan", threshold: 700 });
});
