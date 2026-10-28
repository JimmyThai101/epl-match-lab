import assert from "node:assert/strict";
import { test } from "node:test";
import { availability, groupTeamNews, type NewsPlayer } from "./team-news";

function player(partial: Partial<NewsPlayer> & Pick<NewsPlayer, "id" | "webName">): NewsPlayer {
  return {
    position: "MID",
    status: "a",
    news: "",
    chanceNext: null,
    ...partial,
  };
}

test("injured, suspended, and 0% chance are out", () => {
  assert.equal(availability({ status: "i", chanceNext: 0 }), "out");
  assert.equal(availability({ status: "s", chanceNext: null }), "out");
  assert.equal(availability({ status: "u", chanceNext: 25 }), "out");
  assert.equal(availability({ status: "a", chanceNext: 0 }), "out");
});

test("a published chance between 1% and 99% stays doubtful", () => {
  assert.equal(availability({ status: "d", chanceNext: 50 }), "doubtful");
  assert.equal(availability({ status: "a", chanceNext: 50 }), "doubtful");
  assert.equal(availability({ status: "a", chanceNext: 75 }), "doubtful");
  assert.equal(availability({ status: "a", chanceNext: 100 }), "available");
  assert.equal(availability({ status: "a", chanceNext: null }), "available");
});

test("groups a squad into out, doubtful, and available", () => {
  const groups = groupTeamNews([
    player({ id: 1, webName: "Fit", position: "FWD" }),
    player({ id: 2, webName: "Knock", status: "d", chanceNext: 50, news: "Hamstring" }),
    player({ id: 3, webName: "Out", status: "i", chanceNext: 0, news: "Knee" }),
  ]);
  assert.deepEqual(groups.out.map((item) => item.webName), ["Out"]);
  assert.deepEqual(groups.doubtful.map((item) => item.webName), ["Knock"]);
  assert.deepEqual(groups.available.map((item) => item.webName), ["Fit"]);
});
