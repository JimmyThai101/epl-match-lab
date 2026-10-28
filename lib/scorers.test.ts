import assert from "node:assert/strict";
import { test } from "node:test";
import type { LabTeam } from "./lab-types";
import { seasonScorers } from "./scorers";

function team(id: number, name: string, players: LabTeam["players"]): LabTeam {
  return {
    id,
    name,
    shortName: name.slice(0, 3).toUpperCase(),
    badge: "",
    manager: null,
    played: 1,
    goals: 0,
    conceded: 0,
    goalsPerGame: 0,
    concededPerGame: 0,
    xg: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
    position: 1,
    points: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalDifference: 0,
    form: [],
    players,
    primary: "#000",
    secondary: "#fff",
  };
}

function player(id: number, webName: string, goals: number, assists: number, xg: number): LabTeam["players"][number] {
  return {
    id,
    name: webName,
    webName,
    photo: "",
    position: "FWD",
    positionLabel: "Forward",
    minutes: 90,
    starts: 1,
    goals,
    assists,
    xg,
    xa: 0,
    cleanSheets: 0,
    goalsConceded: 0,
    yellowCards: 0,
    redCards: 0,
    pointsPerGame: "0",
    bonus: 0,
    form: "0",
    status: "a",
    news: "",
    chanceNext: null,
    fplPrice: "£5.0m",
    selectedBy: "1%",
  };
}

test("ranks goals, then assists, then xG", () => {
  const rows = seasonScorers([
    team(1, "Arsenal", [player(1, "Saka", 2, 4, 3)]),
    team(2, "City", [player(2, "Haaland", 5, 0, 4), player(3, "Quiet", 0, 0, 0.1)]),
  ]);
  assert.deepEqual(
    rows.map((row) => row.webName),
    ["Haaland", "Saka", "Quiet"],
  );
  assert.equal(rows[0].teamShort, "CIT");
});
