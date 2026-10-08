"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LabTeam } from "@/lib/lab-types";
import { simulateMatch, type SimEvent } from "@/lib/simulate-match";

const MS_PER_MINUTE: Record<number, number> = {
  1: 220,
  2: 110,
  4: 55,
};

export function SampleMatch({
  home,
  away,
  onOpenWords,
}: {
  home: LabTeam;
  away: LabTeam;
  onOpenWords: () => void;
}) {
  const [seed, setSeed] = useState(1);
  const [minute, setMinute] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(2);
  const autoPlay = useRef(false);
  const match = useMemo(() => simulateMatch(home, away, seed), [away, home, seed]);

  useEffect(() => {
    if (!running) {
      return;
    }
    const timer = window.setInterval(() => {
      setMinute((current) => {
        if (current >= 90) {
          setRunning(false);
          return 90;
        }
        return current + 1;
      });
    }, MS_PER_MINUTE[speed] ?? 110);
    return () => window.clearInterval(timer);
  }, [running, speed]);

  useEffect(() => {
    setMinute(0);
    if (autoPlay.current) {
      autoPlay.current = false;
      setRunning(true);
    } else {
      setRunning(false);
    }
  }, [away.id, home.id, seed]);

  function kickOff() {
    if (minute >= 90) {
      autoPlay.current = true;
      setSeed(Date.now());
      return;
    }
    setRunning(true);
  }

  const shown = match.events.filter((event) => event.minute <= minute);
  const latest = shown.at(-1);
  const liveHome = shown.filter((event) => event.kind === "goal" && event.side === "home").length;
  const liveAway = shown.filter((event) => event.kind === "goal" && event.side === "away").length;
  const ball = latest ?? { x: 50, y: 50, kind: "chance" as const };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 text-white">
      <div className="flex flex-wrap items-start justify-between gap-3 px-4 py-4 sm:px-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Sample match
          </p>
          <h2 className="mt-1 text-xl font-semibold">Watch the numbers move</h2>
          <p className="mt-1 max-w-xl text-sm leading-6 text-slate-300">
            This is not a real fixture. It is a sped-up 90 minutes whose shots and goals are rolled
            from each club&apos;s season rates, so you can feel what &quot;goals per game&quot; looks like.
          </p>
        </div>
        <p className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
          {minute}&apos; / 90&apos;
        </p>
      </div>

      <div className="px-4 sm:px-5">
        <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-3">
          <ClubChip team={home} score={liveHome} side="Home" />
          <p className="text-2xl font-semibold tabular-nums sm:text-3xl">
            {liveHome}–{liveAway}
          </p>
          <ClubChip team={away} score={liveAway} side="Away" />
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <Pitch home={home} away={away} ball={ball} pulse={latest?.kind === "goal"} />
      </div>

      <p className="min-h-12 px-4 text-sm leading-6 text-emerald-100 sm:px-5">
        {minute === 0
          ? "Press kick off. The ball will drift as chances appear."
          : latest?.line ?? "A quiet spell. That happens in real matches too."}
      </p>

      <div className="flex flex-wrap gap-2 px-4 pb-4 sm:px-5">
        <button
          type="button"
          onClick={() => (running ? setRunning(false) : kickOff())}
          className="min-h-11 rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950"
        >
          {minute >= 90 ? "New sample" : running ? "Pause" : minute > 0 ? "Resume" : "Kick off"}
        </button>
        <button
          type="button"
          onClick={() => {
            setRunning(false);
            setMinute(0);
          }}
          className="min-h-11 rounded-full bg-white/10 px-4 py-2 text-sm font-medium"
        >
          Reset clock
        </button>
        {[1, 2, 4].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setSpeed(value)}
            className={`min-h-11 rounded-full px-3 py-2 text-sm ${
              speed === value ? "bg-white text-slate-950" : "bg-white/10"
            }`}
          >
            {value}x
          </button>
        ))}
        <button
          type="button"
          onClick={onOpenWords}
          className="min-h-11 rounded-full bg-white/10 px-4 py-2 text-sm font-medium"
        >
          What am I watching?
        </button>
      </div>

      {minute >= 90 ? (
        <div className="border-t border-white/10 px-4 py-4 text-sm leading-6 text-slate-300 sm:px-5">
          Full time, in this sample: {home.name} {match.finalHome}–{match.finalAway} {away.name}.
          Chances {match.chancesHome}–{match.chancesAway}. Another kick-off will roll a different
          story from the same season rates — luck is part of soccer.
        </div>
      ) : null}

      <ol className="max-h-48 space-y-1 overflow-y-auto border-t border-white/10 px-4 py-3 text-xs leading-5 text-slate-400 sm:px-5">
        {shown.length === 0 ? (
          <li>No events yet. Early minutes are often cagey.</li>
        ) : (
          [...shown].reverse().slice(0, 12).map((event, index) => (
            <li key={`${event.minute}-${event.kind}-${index}`}>{event.line}</li>
          ))
        )}
      </ol>
    </section>
  );
}

function ClubChip({ team, score, side }: { team: LabTeam; score: number; side: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <img src={team.badge} alt="" className="h-8 w-8 object-contain" />
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{side}</p>
        <p className="truncate text-sm font-semibold text-white">{team.shortName}</p>
        <p className="text-[11px] text-slate-400">{score} goals so far</p>
      </div>
    </div>
  );
}

function Pitch({
  home,
  away,
  ball,
  pulse,
}: {
  home: LabTeam;
  away: LabTeam;
  ball: Pick<SimEvent, "x" | "y" | "kind">;
  pulse: boolean;
}) {
  return (
    <div
      className={`relative aspect-[1.7] overflow-hidden rounded-2xl border border-white/10 ${
        pulse ? "ring-2 ring-amber-300" : ""
      }`}
      style={{
        background:
          "repeating-linear-gradient(90deg, #157a3a 0 12.5%, #1b8a44 12.5% 25%)",
      }}
    >
      <div className="absolute inset-2 rounded-lg border-2 border-white/50" />
      <div className="absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-white/50" />
      <div className="absolute left-1/2 top-1/2 h-[22%] w-[14%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/50" />
      <div className="absolute inset-y-[18%] left-2 w-[18%] border-2 border-l-0 border-white/50" />
      <div className="absolute inset-y-[18%] right-2 w-[18%] border-2 border-r-0 border-white/50" />
      <div className="absolute inset-y-[32%] left-2 w-[8%] border-2 border-l-0 border-white/40" />
      <div className="absolute inset-y-[32%] right-2 w-[8%] border-2 border-r-0 border-white/40" />
      <span
        className="absolute top-2 left-3 rounded bg-black/30 px-1.5 py-0.5 text-[10px] font-semibold"
        style={{ color: "#fff" }}
      >
        Home · {home.shortName}
      </span>
      <span className="absolute top-2 right-3 rounded bg-black/30 px-1.5 py-0.5 text-[10px] font-semibold">
        Away · {away.shortName}
      </span>
      <span
        className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-all duration-300"
        style={{ left: `${ball.x}%`, top: `${ball.y}%` }}
      />
    </div>
  );
}
