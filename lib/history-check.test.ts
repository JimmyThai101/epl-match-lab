import assert from "node:assert/strict";
import { test } from "node:test";
import { historyCheckSentence } from "./history-check";

test("history check stays labeled as not a tip", () => {
  const sentence = historyCheckSentence();
  assert.equal(sentence, "History check: 33% on the last 30 finished matches. Not a tip.");
  assert.match(sentence, /Not a tip/);
});
