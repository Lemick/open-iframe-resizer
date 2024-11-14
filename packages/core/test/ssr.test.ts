// @vitest-environment node

import { expect, test } from "vitest";
import { initialize, initializeChildListener } from "../src";

test("API functions shouldn't throw error when executed on unsupported environments with no window (SSR, Node..)", () => {
  expect(typeof window).toBe("undefined");
  expect(initialize).not.toThrow();
  expect(initializeChildListener).not.toThrow();
});
