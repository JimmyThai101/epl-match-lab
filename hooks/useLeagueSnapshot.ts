"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LeagueSnapshot } from "@/lib/lab-types";

const POLL_MS = 5 * 60 * 1000;

export function useLeagueSnapshot() {
  const [data, setData] = useState<LeagueSnapshot | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stale, setStale] = useState(false);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async (background: boolean) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    if (background) {
      setRefreshing(true);
    } else {
      setLoading(true);
      setError("");
    }
    try {
      const response = await fetch("/api/league", {
        cache: "no-store",
        signal: controller.signal,
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || "Could not load league data.");
      }
      setData(json as LeagueSnapshot);
      setCheckedAt(new Date().toISOString());
      setStale(false);
      setError("");
    } catch (err) {
      if (controller.signal.aborted) {
        return;
      }
      const message = err instanceof Error ? err.message : "Could not load league data.";
      setError(message);
      setStale(Boolean(background));
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    void load(false);
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void load(true);
      }
    }, POLL_MS);

    function onVisible() {
      if (document.visibilityState === "visible") {
        void load(true);
      }
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      abortRef.current?.abort();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  return {
    data,
    error,
    loading,
    refreshing,
    stale,
    checkedAt,
    refresh: () => load(true),
    retry: () => load(false),
  };
}
