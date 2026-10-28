import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildShareCard, ogImagePath, shareCopy } from "./share";

describe("shareCopy", () => {
  it("keeps scout titles shareable and honest", () => {
    const copy = shareCopy({
      homeName: "Arsenal",
      awayName: "Fulham",
      tab: "scout",
      playerA: "Saka",
      playerB: "Haaland",
    });
    assert.equal(copy.title, "Scout: Saka vs Haaland · EPL Match Lab");
    assert.match(copy.description, /not a transfer fee/i);
  });

  it("labels Play as a sample, not a tip", () => {
    const copy = shareCopy({
      homeName: "Arsenal",
      awayName: "Fulham",
      tab: "play",
    });
    assert.match(copy.title, /sample match/i);
    assert.match(copy.description, /not a prediction/i);
  });
});

describe("buildShareCard", () => {
  const teams = [
    { id: 1, name: "Arsenal", shortName: "ARS" },
    { id: 3, name: "Fulham", shortName: "FUL" },
    { id: 43, name: "Man City", shortName: "MCI" },
  ];
  const players = [
    { id: 22, webName: "Saka" },
    { id: 411, webName: "Haaland" },
  ];

  it("uses club ids from the URL", () => {
    const card = buildShareCard({
      teams,
      players,
      search: { a: "1", b: "3", tab: "overview" },
    });
    assert.equal(card.headline, "Arsenal vs Fulham");
    assert.equal(card.home?.shortName, "ARS");
  });

  it("prefers player ids for Scout", () => {
    const card = buildShareCard({
      teams,
      players,
      search: { a: "1", b: "3", tab: "scout", player: "Saka", pid: "22", vs: "411" },
    });
    assert.equal(card.headline, "Saka vs Haaland");
    assert.equal(card.eyebrow, "EPL Match Lab · Scout");
  });
});

describe("ogImagePath", () => {
  it("omits empty query keys", () => {
    assert.equal(ogImagePath({}), "/api/og");
    assert.equal(ogImagePath({ a: "1", b: "10", tab: "scout", player: "Saka" }), "/api/og?a=1&b=10&tab=scout&player=Saka");
  });
});
