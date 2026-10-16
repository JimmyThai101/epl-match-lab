"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ContractsPanel } from "@/components/lab/ContractsPanel";
import { FixturesPanel } from "@/components/lab/FixturesPanel";
import { GuidePanel } from "@/components/lab/GuidePanel";
import { SampleMatch } from "@/components/lab/SampleMatch";
import { SimulationSummary } from "@/components/lab/SimulationSummary";
import { TeamPicker } from "@/components/lab/LabBits";
import { SnapshotPanel } from "@/components/lab/SnapshotPanel";
import { ScoutPanel } from "@/components/lab/ScoutPanel";
import { SquadPanel } from "@/components/lab/SquadPanel";
import { TablePanel } from "@/components/lab/TablePanel";
import { useLeagueSnapshot } from "@/hooks/useLeagueSnapshot";
import { formatCheckedAt } from "@/lib/format";
import { explainMatch } from "@/lib/insights";
import type { ClubNotes } from "@/lib/lab-types";
import { resolveMatchup } from "@/lib/matchup-selection";
import { readJson, writeJson } from "@/lib/storage";

type Chunk = "overview" | "play" | "guide" | "table" | "fixtures" | "squad" | "scout" | "contracts";

const CHUNKS: { id: Chunk; label: string; hint: string }[] = [
  { id: "overview", label: "Snapshot", hint: "Compare the two clubs" },
  { id: "play", label: "Play", hint: "Sample match on a pitch" },
  { id: "guide", label: "Words", hint: "Beginner dictionary" },
  { id: "table", label: "Table", hint: "Whole league" },
  { id: "fixtures", label: "Fixtures", hint: "Scores and dates" },
  { id: "squad", label: "Players", hint: "Search the squads" },
  { id: "scout", label: "Scout", hint: "Similar players" },
  { id: "contracts", label: "Money", hint: "Only if listed" },
];

const PIN_KEY = "epl-match-lab-pin";

function isChunk(value: string | null): value is Chunk {
  return CHUNKS.some((chunk) => chunk.id === value);
}

export function MatchLab() {
  const { data, error, loading, stale, checkedAt, refresh, retry } = useLeagueSnapshot();
  const [homeId, setHomeId] = useState<number | null>(null);
  const [awayId, setAwayId] = useState<number | null>(null);
  const [chunk, setChunk] = useState<Chunk>("overview");
  const [notes, setNotes] = useState<Record<string, ClubNotes>>({});
  const [copied, setCopied] = useState(false);
  const requestedNotes = useRef(new Set<string>());
  const hydrated = useRef(false);

  useEffect(() => {
    if (!data || hydrated.current) {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const pin = readJson<{ a?: number; b?: number; season?: string }>(PIN_KEY);
    const usePin = pin?.season === data.seasonKey ? pin : null;
    const resolved = resolveMatchup(data.teams, {
      home: Number(params.get("a") || usePin?.a || NaN),
      away: Number(params.get("b") || usePin?.b || NaN),
    });
    setHomeId(resolved.homeId);
    setAwayId(resolved.awayId);
    const tab = params.get("tab");
    if (isChunk(tab)) {
      setChunk(tab);
    }
    hydrated.current = true;
  }, [data]);

  const home = data?.teams.find((team) => team.id === homeId) ?? null;
  const away = data?.teams.find((team) => team.id === awayId) ?? null;

  useEffect(() => {
    if (!hydrated.current || !homeId || !awayId || !data) {
      return;
    }
    const params = new URLSearchParams({
      a: String(homeId),
      b: String(awayId),
      tab: chunk,
    });
    window.history.replaceState(null, "", `/lab?${params.toString()}`);
    writeJson(PIN_KEY, { a: homeId, b: awayId, season: data.seasonKey });
  }, [awayId, chunk, data, homeId]);

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
    const resolved = resolveMatchup(data.teams, {
      home: data.teams[Math.floor(Math.random() * data.teams.length)]?.id,
      away: null,
    });
    const ids = data.teams.map((team) => team.id);
    const first = ids[Math.floor(Math.random() * ids.length)];
    const second = ids.filter((id) => id !== first)[Math.floor(Math.random() * (ids.length - 1))];
    setHomeId(first);
    setAwayId(second ?? resolved.awayId);
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

  if (error && !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800">
        <p>{error}</p>
        <button
          type="button"
          onClick={() => retry()}
          className="mt-3 min-h-11 rounded-full bg-red-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  if (loading || !data || !home || !away) {
    return <p className="text-sm text-slate-500">Loading current Premier League squads…</p>;
  }

  const progress =
    data.totalMatches > 0 ? Math.round((data.finishedMatches / data.totalMatches) * 100) : 0;
  const checkedLabel = formatCheckedAt(checkedAt);

  return (
    <div className="space-y-5 pb-20 sm:space-y-8 sm:pb-8">
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
        <p className="mt-3 text-xs text-slate-500">
          {stale
            ? "Couldn’t update. Showing the previous snapshot."
            : checkedLabel
              ? `Last checked: ${checkedLabel}`
              : "Checking…"}
          <button type="button" onClick={() => refresh()} className="ml-2 font-semibold text-slate-800 underline">
            Refresh
          </button>
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
      </section>

      <div
        role="navigation"
        aria-label="Lab sections"
        className="sticky top-0 z-20 -mx-4 bg-slate-100/95 px-4 py-2 backdrop-blur print:hidden sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none pt-[max(0.5rem,env(safe-area-inset-top))] sm:pt-0"
      >
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
          {CHUNKS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={chunk === item.id ? "page" : undefined}
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
          xgNote={data.xgNote}
          onOpenPlay={() => setChunk("play")}
        />
      ) : null}
      {chunk === "play" ? (
        <div className="space-y-4">
          <SampleMatch home={home} away={away} />
          <SimulationSummary home={home} away={away} />
        </div>
      ) : null}
      {chunk === "table" ? (
        <TablePanel data={data} homeId={home.id} awayId={away.id} onPick={chooseHome} />
      ) : null}
      {chunk === "fixtures" ? (
        <FixturesPanel data={data} home={home} away={away} checkedAt={checkedAt} />
      ) : null}
      {chunk === "squad" ? <SquadPanel home={home} away={away} /> : null}
      {chunk === "scout" ? <ScoutPanel teams={data.teams} /> : null}
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
