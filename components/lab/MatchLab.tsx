"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ContractsPanel } from "@/components/lab/ContractsPanel";
import { FixturesPanel } from "@/components/lab/FixturesPanel";
import { GuidePanel } from "@/components/lab/GuidePanel";
import { SampleMatch } from "@/components/lab/SampleMatch";
import { TeamPicker } from "@/components/lab/LabBits";
import { SnapshotPanel } from "@/components/lab/SnapshotPanel";
import { SquadPanel } from "@/components/lab/SquadPanel";
import { TablePanel } from "@/components/lab/TablePanel";
import { explainMatch } from "@/lib/insights";
import type { ClubNotes, LeagueSnapshot } from "@/lib/lab-types";

type Chunk = "overview" | "play" | "guide" | "table" | "fixtures" | "squad" | "contracts";

const CHUNKS: { id: Chunk; label: string; hint: string }[] = [
  { id: "overview", label: "Snapshot", hint: "Compare the two clubs" },
  { id: "play", label: "Play", hint: "Sample match on a pitch" },
  { id: "guide", label: "Words", hint: "Beginner dictionary" },
  { id: "table", label: "Table", hint: "Whole league" },
  { id: "fixtures", label: "Fixtures", hint: "Scores and dates" },
  { id: "squad", label: "Players", hint: "Search the squads" },
  { id: "contracts", label: "Money", hint: "Only if listed" },
];

const PIN_KEY = "epl-match-lab-pin";

function isChunk(value: string | null): value is Chunk {
  return CHUNKS.some((chunk) => chunk.id === value);
}

export function MatchLab() {
  const [data, setData] = useState<LeagueSnapshot | null>(null);
  const [error, setError] = useState("");
  const [homeId, setHomeId] = useState<number | null>(null);
  const [awayId, setAwayId] = useState<number | null>(null);
  const [chunk, setChunk] = useState<Chunk>("overview");
  const [notes, setNotes] = useState<Record<string, ClubNotes>>({});
  const [copied, setCopied] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const requestedNotes = useRef(new Set<string>());
  const hydrated = useRef(false);

  useEffect(() => {
    fetch("/api/league")
      .then(async (response) => {
        const json = await response.json();
        if (!response.ok) {
          throw new Error(json.error || "Could not load league data.");
        }
        return json as LeagueSnapshot;
      })
      .then((snapshot) => {
        setData(snapshot);
        const params = new URLSearchParams(window.location.search);
        const pinned = window.localStorage.getItem(PIN_KEY);
        let fromPin: { a?: number; b?: number } = {};
        try {
          fromPin = pinned ? (JSON.parse(pinned) as { a?: number; b?: number }) : {};
        } catch {
          fromPin = {};
        }
        const ids = new Set(snapshot.teams.map((team) => team.id));
        const arsenal = snapshot.teams.find((team) => team.name === "Arsenal")?.id;
        const city = snapshot.teams.find((team) => team.name === "Man City")?.id;
        const fallbackA = arsenal ?? snapshot.teams[0]?.id ?? null;
        const fallbackB =
          city ??
          snapshot.teams.find((team) => team.id !== fallbackA)?.id ??
          null;
        const nextA = Number(params.get("a") || fromPin.a || fallbackA);
        const nextB = Number(params.get("b") || fromPin.b || fallbackB);
        setHomeId(ids.has(nextA) ? nextA : fallbackA);
        setAwayId(ids.has(nextB) && nextB !== nextA ? nextB : fallbackB);
        const tab = params.get("tab");
        if (isChunk(tab)) {
          setChunk(tab);
        }
        hydrated.current = true;
        try {
          setShowWelcome(!window.localStorage.getItem("epl-lab-welcome"));
        } catch {
          setShowWelcome(true);
        }
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  const home = data?.teams.find((team) => team.id === homeId) ?? null;
  const away = data?.teams.find((team) => team.id === awayId) ?? null;

  useEffect(() => {
    if (!hydrated.current || !homeId || !awayId) {
      return;
    }
    const params = new URLSearchParams({
      a: String(homeId),
      b: String(awayId),
      tab: chunk,
    });
    window.history.replaceState(null, "", `/lab?${params.toString()}`);
    window.localStorage.setItem(PIN_KEY, JSON.stringify({ a: homeId, b: awayId }));
  }, [awayId, chunk, homeId]);

  useEffect(() => {
    if (chunk !== "contracts" && chunk !== "overview") {
      return;
    }
    const names = [home?.name, away?.name].filter(Boolean) as string[];
    for (const name of names) {
      if (requestedNotes.current.has(name)) {
        continue;
      }
      requestedNotes.current.add(name);
      fetch(`/api/club-notes?name=${encodeURIComponent(name)}`)
        .then((response) => response.json())
        .then((json: ClubNotes) => {
          setNotes((current) => ({ ...current, [name]: json }));
        })
        .catch(() => {
          setNotes((current) => ({
            ...current,
            [name]: {
              stadium: null,
              location: null,
              contracts: [],
              note: "Extra club notes are unavailable right now.",
            },
          }));
        });
    }
  }, [away?.name, chunk, home?.name]);

  const reading = useMemo(() => {
    if (!home || !away) {
      return [];
    }
    return explainMatch(home, away);
  }, [away, home]);

  function chooseHome(id: number) {
    if (id === awayId && homeId) {
      setAwayId(homeId);
    }
    setHomeId(id);
  }

  function chooseAway(id: number) {
    if (id === homeId && awayId) {
      setHomeId(awayId);
    }
    setAwayId(id);
  }

  function swapSides() {
    setHomeId(awayId);
    setAwayId(homeId);
  }

  function randomPair() {
    if (!data) {
      return;
    }
    const ids = data.teams.map((team) => team.id);
    const first = ids[Math.floor(Math.random() * ids.length)];
    let second = first;
    while (second === first) {
      second = ids[Math.floor(Math.random() * ids.length)];
    }
    setHomeId(first);
    setAwayId(second);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  if (error) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        {error}
      </p>
    );
  }

  if (!data || !home || !away) {
    return <p className="text-sm text-slate-500">Loading current Premier League squads…</p>;
  }

  const progress = Math.round((data.finishedMatches / data.totalMatches) * 100);

  return (
    <div className="space-y-5 pb-20 sm:space-y-8 sm:pb-8">
      {showWelcome ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 sm:px-5">
          <p className="text-sm font-semibold text-amber-950">Three doors, then you&apos;re in</p>
          <p className="mt-1 text-sm leading-6 text-amber-900/80">
            Words = short meanings + a pitch. Play = a fake 90 minutes. Snapshot = the numbers.
            None of it predicts a real result.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setChunk("guide")}
              className="min-h-11 rounded-full bg-amber-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Open Words
            </button>
            <button
              type="button"
              onClick={() => setChunk("play")}
              className="min-h-11 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
            >
              Play a sample
            </button>
            <button
              type="button"
              onClick={() => {
                setShowWelcome(false);
                try {
                  window.localStorage.setItem("epl-lab-welcome", "1");
                } catch {
                  /* ignore */
                }
              }}
              className="min-h-11 rounded-full bg-white px-4 py-2 text-sm font-medium text-amber-950 ring-1 ring-amber-200"
            >
              Got it
            </button>
          </div>
        </div>
      ) : null}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 print:border-0">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
              {data.gameweek}
            </p>
            <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">Pick any matchup</h1>
          </div>
          <p className="text-xs text-slate-500">
            {data.finishedMatches}/{data.totalMatches} matches played
          </p>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full bg-emerald-500" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:block">
          <span className="sm:hidden">
            Home is always left, away is always right. Kit colour is the dots and bars, not the names.
          </span>
          <span className="hidden sm:inline">{data.sourceNote}</span>
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <TeamPicker
            label="Home (left)"
            teams={data.teams}
            value={home.id}
            blocked={away.id}
            onChange={chooseHome}
            accent={home.primary}
          />
          <TeamPicker
            label="Away (right)"
            teams={data.teams}
            value={away.id}
            blocked={home.id}
            onChange={chooseAway}
            accent={away.primary}
          />
        </div>
        <p className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-base font-semibold text-slate-900 sm:text-lg">
          <span className="inline-flex flex-col items-center gap-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Home</span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ background: home.primary }} />
              {home.name}
            </span>
          </span>
          <span className="text-slate-400">vs</span>
          <span className="inline-flex flex-col items-center gap-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Away</span>
            <span className="inline-flex items-center gap-2">
              {away.name}
              <span className="h-3 w-3 rounded-full" style={{ background: away.primary }} />
            </span>
          </span>
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2 print:hidden">
          <button
            type="button"
            onClick={swapSides}
            className="min-h-11 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Swap sides
          </button>
          <button
            type="button"
            onClick={randomPair}
            className="min-h-11 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Random pair
          </button>
          <button
            type="button"
            onClick={copyLink}
            className="min-h-11 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            {copied ? "Link copied" : "Copy link"}
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-slate-500">{data.updatedLabel}</p>
      </section>

      <div className="sticky top-0 z-20 -mx-4 bg-slate-100/95 px-4 py-2 backdrop-blur print:hidden sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none pt-[max(0.5rem,env(safe-area-inset-top))] sm:pt-0">
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
          {CHUNKS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setChunk(item.id)}
              className={`snap-start shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition min-h-11 ${
                chunk === item.id
                  ? "bg-slate-900 text-white"
                  : item.id === "guide"
                    ? "bg-amber-50 text-amber-950 ring-1 ring-amber-300 hover:bg-amber-100"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {item.label}
              <span className="ml-2 hidden text-xs font-normal opacity-70 lg:inline">
                {item.hint}
              </span>
            </button>
          ))}
        </div>
      </div>

      {chunk === "overview" ? (
        <SnapshotPanel
          home={home}
          away={away}
          homeNotes={notes[home.name] ?? null}
          awayNotes={notes[away.name] ?? null}
          reading={reading}
          onOpenWords={() => setChunk("guide")}
          onOpenPlay={() => setChunk("play")}
        />
      ) : null}
      {chunk === "play" ? (
        <SampleMatch home={home} away={away} onOpenWords={() => setChunk("guide")} />
      ) : null}
      {chunk === "table" ? (
        <TablePanel data={data} homeId={home.id} awayId={away.id} onPick={chooseHome} />
      ) : null}
      {chunk === "fixtures" ? <FixturesPanel data={data} home={home} away={away} /> : null}
      {chunk === "squad" ? <SquadPanel home={home} away={away} /> : null}
      {chunk === "contracts" ? (
        <ContractsPanel
          home={home}
          away={away}
          homeNotes={notes[home.name] ?? null}
          awayNotes={notes[away.name] ?? null}
        />
      ) : null}
      {chunk === "guide" ? <GuidePanel /> : null}

      {chunk !== "guide" ? (
        <button
          type="button"
          onClick={() => setChunk("guide")}
          className="fixed bottom-4 right-4 z-30 min-h-12 rounded-full bg-amber-900 px-4 text-sm font-semibold text-white shadow-lg print:hidden"
        >
          Words
        </button>
      ) : null}
    </div>
  );
}
