import assert from "node:assert/strict";
import { test } from "node:test";
import { labIndex, similarPlayers, type ScoutedPlayer } from "./scout";

function player(partial: Partial<ScoutedPlayer> & Pick<ScoutedPlayer, "id" | "webName">): ScoutedPlayer {
  return {
    name: partial.webName,
    photo: "",
    position: "MID",
    positionLabel: "Midfielder",
    minutes: 450,
    starts: 5,
    goals: 3,
    assists: 1,
    xg: 2.5,
    xa: 1,
    cleanSheets: 0,
    goalsConceded: 4,
    yellowCards: 1,
    redCards: 0,
    pointsPerGame: "4.0",
    bonus: 2,
    form: "3.0",
    status: "a",
    news: "",
    chanceNext: 100,
    fplPrice: "£8.0m",
    selectedBy: "10%",
    club: "Arsenal",
    clubShort: "ARS",
    clubId: 1,
    ...partial,
  };
}

test("a player is most like a copy of themselves, not a defender with no goals", () => {
  const saka = player({ id: 1, webName: "Saka", goals: 5, assists: 3, xg: 4 });
  const twin = player({ id: 2, webName: "Twin", goals: 5, assists: 3, xg: 4, club: "City", clubId: 2 });
  const other = player({
    id: 3,
    webName: "Stopper",
    position: "DEF",
    positionLabel: "Defender",
    goals: 0,
    assists: 0,
    xg: 0,
    minutes: 900,
    club: "Palace",
    clubId: 3,
  });
  const ranked = similarPlayers(saka, [saka, twin, other], 2);
  assert.equal(ranked[0].player.webName, "Twin");
});

test("lab index is a stat score, not a transfer fee", () => {
  const quiet = player({ id: 1, webName: "A", goals: 0, assists: 0, xg: 0, xa: 0, minutes: 90 });
  const loud = player({ id: 2, webName: "B", goals: 6, assists: 4, xg: 5, xa: 3, minutes: 90 });
  assert.ok(labIndex(loud) > labIndex(quiet));
});
