import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveMatchup } from "./matchup-selection";

const teams = [
  { id: 1, name: "Arsenal" },
  { id: 15, name: "Man City" },
  { id: 12, name: "Man Utd" },
];

test("never returns the same club twice", () => {
  const same = resolveMatchup(teams, { home: 15, away: 15 });
  assert.notEqual(same.homeId, same.awayId);
  assert.equal(same.homeId, 15);
  assert.equal(same.awayId, 1);
});

test("falls back when ids are missing", () => {
  const picked = resolveMatchup(teams, { home: 99, away: 99 });
  assert.equal(picked.homeId, 1);
  assert.equal(picked.awayId, 15);
});

test("keeps a valid requested away club", () => {
  const picked = resolveMatchup(teams, { home: 1, away: 12 });
  assert.equal(picked.homeId, 1);
  assert.equal(picked.awayId, 12);
});
