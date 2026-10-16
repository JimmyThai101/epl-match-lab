import assert from "node:assert/strict";
import { test } from "node:test";
import { simulateMatch, summarizeSimulations } from "./simulate-match";
import type { LabTeam } from "./lab-types";

const team = (id: number, name: string, gpg: number, cpg: number): LabTeam => ({
  id,
  name,
  shortName: name.slice(0, 3).toUpperCase(),
  badge: "",
  manager: null,
  played: 5,
  goals: Math.round(gpg * 5),
  conceded: Math.round(cpg * 5),
  goalsPerGame: gpg,
  concededPerGame: cpg,
  xg: 5,
  assists: 3,
  yellowCards: 4,
  redCards: 0,
  position: 1,
  points: 10,
  won: 3,
  drawn: 1,
  lost: 1,
  goalDifference: 2,
  form: ["W", "W", "D", "L", "W"],
  players: [],
  primary: "#000",
  secondary: "#fff",
});

test("the same seed repeats the same sample match", () => {
  const home = team(1, "Arsenal", 1.6, 0.8);
  const away = team(2, "City", 2.2, 1);
  const a = simulateMatch(home, away, 99);
  const b = simulateMatch(home, away, 99);
  assert.equal(a.finalHome, b.finalHome);
  assert.equal(a.finalAway, b.finalAway);
  assert.equal(a.events.length, b.events.length);
});

test("many samples add up to the batch size", () => {
  const home = team(1, "Arsenal", 1.6, 0.8);
  const away = team(2, "City", 2.2, 1);
  const summary = summarizeSimulations(home, away, 50, 3);
  assert.equal(summary.samples, 50);
  assert.equal(summary.homeWins + summary.draws + summary.awayWins, 50);
});
