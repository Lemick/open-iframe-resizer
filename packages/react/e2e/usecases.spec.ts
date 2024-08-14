import { test } from "@playwright/test";

const allIframesHasBeenResized = () => {
	if (!window.document || window.document.getElementsByTagName("iframe").length === 0) {
		return false;
	}
	const children = [...window.document.getElementsByTagName("iframe")];
	return children.every((iframe) => iframe.offsetHeight > 700);
};

test("Should resize an Iframe with the React component", async ({ page }) => {
	await page.goto("/");

	await page.getByRole("button", { name: "Mount IFrame" }).click();
	await page.waitForFunction(allIframesHasBeenResized);
});
