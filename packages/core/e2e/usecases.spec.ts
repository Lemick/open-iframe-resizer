import { test } from "@playwright/test";

const allIframesHasBeenResized = () => {
	if (!window.document || window.document.getElementsByTagName("iframe").length === 0) {
		return false;
	}
	const children = [...window.document.getElementsByTagName("iframe")];
	return children.every((iframe) => iframe.offsetHeight > 700);
};

test("Should load lib with ESM and resize iframe", async ({ page }) => {
	await page.goto("/usecases/01-module-load/index.html");

	await page.waitForFunction(allIframesHasBeenResized);
});

test(" Should load lib with UMD and resize iframe", async ({ page }) => {
	await page.goto("/usecases/02-umd-load/index.html");

	await page.waitForFunction(allIframesHasBeenResized);
});

test("Should resize multiples iframes", async ({ page }) => {
	await page.goto("/usecases/03-multiple-iframes/index.html");

	await page.waitForFunction(allIframesHasBeenResized);
});

test("Should resize nested iframes", async ({ page }) => {
	await page.goto("/usecases/04-nested-iframes/index.html");

	await page.waitForFunction(allIframesHasBeenResized);
});

test("Should resize iframe from a different-origin", async ({ page }) => {
	await page.goto("/usecases/05-cross-origin/index.html");

	await page.waitForFunction(allIframesHasBeenResized);
});

test("Should resize iframe from a different-origin with custom allowed origin", async ({ page }) => {
	await page.goto("/usecases/07-custom-allowed-origins/index.html");

	await page.waitForFunction(allIframesHasBeenResized);
});
