"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ContractsPanel } from "@/components/lab/ContractsPanel";
import { FixturesPanel } from "@/components/lab/FixturesPanel";
import { GuidePanel } from "@/components/lab/GuidePanel";
import { TeamPicker } from "@/components/lab/LabBits";
import { SnapshotPanel } from "@/components/lab/SnapshotPanel";
import { SquadPanel } from "@/components/lab/SquadPanel";
import { TablePanel } from "@/components/lab/TablePanel";
import { explainMatch } from "@/lib/insights";
import type { ClubNotes, LeagueSnapshot } from "@/lib/lab-types";

type Chunk = "overview" | "table" | "fixtures" | "squad" | "contracts" | "guide";

const CHUNKS: { id: Chunk; label: string; hint: string }[] = [
  { id: "overview", label: "1. Snapshot", hint: "Compare the two clubs" },
  { id: "table", label: "2. Table", hint: "Whole league" },
  { id: "fixtures", label: "3. Fixtures", hint: "Scores and dates" },
  { id: "squad", label: "4. Players", hint: "Search the squads" },
  { id: "contracts", label: "5. Money", hint: "Only if listed" },
  { id: "guide", label: "6. Words", hint: "Beginner glossary" },
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
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
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
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 print:border-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
              {data.gameweek}
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">Pick any matchup</h1>
          </div>
          <p className="text-xs text-slate-500">
            {data.finishedMatches}/{data.totalMatches} matches played
          </p>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full bg-emerald-500" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{data.sourceNote}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <TeamPicker
            label="Team A"
            teams={data.teams}
            value={home.id}
            blocked={away.id}
            onChange={chooseHome}
          />
          <TeamPicker
            label="Team B"
            teams={data.teams}
            value={away.id}
            blocked={home.id}
            onChange={chooseAway}
          />
        </div>
        <p className="mt-4 text-center text-lg font-semibold text-slate-900">
          {home.name} vs {away.name}
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2 print:hidden">
          <button
            type="button"
            onClick={swapSides}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
          >
            Swap sides
          </button>
          <button
            type="button"
            onClick={randomPair}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
          >
            Random pair
          </button>
          <button
            type="button"
            onClick={copyLink}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
          >
            {copied ? "Link copied" : "Copy link"}
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-slate-500">{data.updatedLabel}</p>
      </section>

      <div className="flex flex-wrap gap-2 print:hidden">
        {CHUNKS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setChunk(item.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              chunk === item.id
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {item.label}
            <span className="ml-2 hidden text-xs font-normal opacity-70 sm:inline">
              {item.hint}
            </span>
          </button>
        ))}
      </div>

      {chunk === "overview" ? (
        <SnapshotPanel
          home={home}
          away={away}
          homeNotes={notes[home.name] ?? null}
          awayNotes={notes[away.name] ?? null}
          reading={reading}
        />
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
    </div>
  );
}
