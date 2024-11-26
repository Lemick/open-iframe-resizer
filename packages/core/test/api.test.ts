// @vitest-environment node

import { expect, test } from "vitest";
import * as apiModule from "../src";

test("Check that API attributes are not renamed by mistake", () => {
  expect(typeof window).toBe("undefined");

  expect(Object.keys(apiModule)).toEqual(["initialize", "initializeChildListener", "updateParentScrollOnResize"]);
});
