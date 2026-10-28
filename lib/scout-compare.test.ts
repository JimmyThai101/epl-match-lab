import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { barWidths, radarPolygon } from "./scout-compare";

describe("barWidths", () => {
  it("fills the larger value to 100%", () => {
    assert.deepEqual(barWidths(8, 2), { a: 100, b: 25 });
  });

  it("stays empty when both are zero", () => {
    assert.deepEqual(barWidths(0, 0), { a: 0, b: 0 });
  });
});

describe("radarPolygon", () => {
  it("puts the stronger side farther from centre on that axis", () => {
    const rows = [
      { key: "g", label: "Goals", a: 10, b: 0 },
      { key: "a", label: "Assists", a: 0, b: 0 },
    ];
    const left = radarPolygon(rows, "a", 100, 100, 50);
    const right = radarPolygon(rows, "b", 100, 100, 50);
    const [lx] = left.split(" ")[0].split(",").map(Number);
    const [rx] = right.split(" ")[0].split(",").map(Number);
    assert.equal(lx, 100);
    assert.equal(rx, 100);
    const ly = Number(left.split(" ")[0].split(",")[1]);
    const ry = Number(right.split(" ")[0].split(",")[1]);
    assert.ok(ly < ry);
  });
});
