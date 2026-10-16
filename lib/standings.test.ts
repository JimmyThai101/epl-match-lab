import assert from "node:assert/strict";
import { test } from "node:test";
import { buildTable, recentResults, upcomingFixtures } from "./standings";
import type { LabFixture } from "./lab-types";

function fixture(partial: Partial<LabFixture> & Pick<LabFixture, "id" | "homeId" | "awayId">): LabFixture {
  return {
    event: 1,
    kickoff: null,
    homeScore: null,
    awayScore: null,
    finished: false,
    started: false,
    minutes: 0,
    homeDifficulty: 3,
    awayDifficulty: 3,
    homeScorers: [],
    awayScorers: [],
    ...partial,
  };
}

test("empty fixture list is a real zero table, not a fake season", () => {
  const table = buildTable([1, 2], []);
  assert.equal(table[0].played, 0);
  assert.equal(table[0].points, 0);
});

test("finished matches add points in kickoff order", () => {
  const table = buildTable(
    [1, 2],
    [
      fixture({
        id: 2,
        homeId: 1,
        awayId: 2,
        finished: true,
        homeScore: 2,
        awayScore: 0,
        kickoff: "2026-08-20T14:00:00Z",
      }),
      fixture({
        id: 1,
        homeId: 2,
        awayId: 1,
        finished: true,
        homeScore: 1,
        awayScore: 1,
        kickoff: "2026-08-13T14:00:00Z",
      }),
    ],
  );
  const home = table.find((row) => row.teamId === 1);
  assert.equal(home?.points, 4);
  assert.deepEqual(home?.form, ["D", "W"]);
});

test("upcoming fixtures put unknown kickoffs last", () => {
  const upcoming = upcomingFixtures(
    [
      fixture({ id: 1, homeId: 1, awayId: 2, kickoff: null }),
      fixture({ id: 2, homeId: 1, awayId: 2, kickoff: "2026-10-20T14:00:00Z" }),
    ],
    1,
  );
  assert.equal(upcoming[0].id, 2);
  assert.equal(upcoming[1].id, 1);
});

test("recent results are chronological", () => {
  const recent = recentResults(
    [
      fixture({
        id: 1,
        homeId: 1,
        awayId: 2,
        finished: true,
        homeScore: 1,
        awayScore: 0,
        kickoff: "2026-08-20T14:00:00Z",
      }),
      fixture({
        id: 2,
        homeId: 2,
        awayId: 1,
        finished: true,
        homeScore: 0,
        awayScore: 2,
        kickoff: "2026-08-13T14:00:00Z",
      }),
    ],
    1,
  );
  assert.equal(recent[0].id, 1);
  assert.equal(recent[1].id, 2);
});
