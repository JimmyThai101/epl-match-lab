import assert from "node:assert/strict";
import { test } from "node:test";
import { fetchFplFixtures } from "./fpl";

test("a failed fixture request throws instead of looking like zero games", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = (async () =>
    new Response("nope", { status: 503 })) as typeof fetch;
  try {
    await assert.rejects(() => fetchFplFixtures(), /unavailable \(503\)/);
  } finally {
    globalThis.fetch = original;
  }
});
