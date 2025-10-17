import { test } from "@playwright/test";
import { type AssertArg, allIframesOffsetHeightMatch } from "./utils";

test("Should not resize iframe until button triggers imperative resize", async ({ page }) => {
  await page.goto("/usecases/20-imperative-resize/index.html");

  await page.waitForTimeout(1000);

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "lesserThan", threshold: 300 });

  await page.getByRole("button", { name: "Resize iframe" }).click();

  await page.waitForFunction<boolean, AssertArg>(allIframesOffsetHeightMatch, { comparator: "greaterThan", threshold: 1000 });
});
