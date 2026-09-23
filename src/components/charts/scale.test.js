import { describe, expect, it } from "vitest";
import { niceTicks } from "./scale";

describe("niceTicks", () => {
  it("covers the max with round steps", () => {
    expect(niceTicks(37)).toEqual([0, 10, 20, 30, 40]);
    expect(niceTicks(9)).toEqual([0, 2.5, 5, 7.5, 10]);
  });

  it("still draws an axis when everything is zero", () => {
    expect(niceTicks(0)).toEqual([0, 1]);
  });

  it("never ends below the max", () => {
    for (const max of [1, 3, 17, 99, 1234]) {
      const ticks = niceTicks(max);
      expect(ticks.at(-1)).toBeGreaterThanOrEqual(max);
    }
  });
});
