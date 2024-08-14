import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { isIframeSameOrigin } from "../src/common";

describe("isIframeSameOrigin", () => {
	let iframe: HTMLIFrameElement;

	beforeEach(() => {
		iframe = document.createElement("iframe");
		document.body.appendChild(iframe);
	});

	afterEach(() => {
		document.body.removeChild(iframe);
	});

	test.each([
		{ src: `${window.location.origin}/test-page.html`, expected: true, description: "same-origin URL" },
		{ src: "https://example.com/test-page.html", expected: false, description: "cross-origin URL" },
		{ src: "/test-page.html", expected: true, description: "relative URL (same-origin)" },
		{ src: "", expected: true, description: "empty src (same-origin)" },
	])("returns $expected for $description", ({ src, expected }) => {
		iframe.src = src;
		expect(isIframeSameOrigin(iframe)).toBe(expected);
	});
});
