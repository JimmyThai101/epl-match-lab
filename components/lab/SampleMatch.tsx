"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { isLightColor } from "@/lib/kit-colors";
import type { LabTeam } from "@/lib/lab-types";
import { simulateMatch, type SimEvent } from "@/lib/simulate-match";

const MS_PER_MINUTE: Record<number, number> = {
  1: 220,
  2: 110,
  4: 55,
};

const HOME_SHAPE = [
  { x: 7, y: 50 },
  { x: 18, y: 18 },
  { x: 20, y: 38 },
  { x: 20, y: 62 },
  { x: 18, y: 82 },
  { x: 32, y: 28 },
  { x: 34, y: 50 },
  { x: 32, y: 72 },
  { x: 46, y: 32 },
  { x: 48, y: 50 },
  { x: 46, y: 68 },
];

export function SampleMatch({
  home,
  away,
}: {
  home: LabTeam;
  away: LabTeam;
}) {
  const [seed, setSeed] = useState(1);
  const [minute, setMinute] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(2);
  const [tick, setTick] = useState(0);
  const [flash, setFlash] = useState<SimEvent | null>(null);
  const autoPlay = useRef(false);
  const lastGoalKey = useRef<string | null>(null);
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
    if (!running || minute >= 90) {
      return;
    }
    const started = Date.now();
    setTick(0);
    const timer = window.setInterval(() => {
      setTick(Date.now() - started);
    }, 80);
    return () => window.clearInterval(timer);
  }, [minute, running]);

  useEffect(() => {
    setMinute(0);
    setTick(0);
    setFlash(null);
    lastGoalKey.current = null;
    if (autoPlay.current) {
      autoPlay.current = false;
      setRunning(true);
    } else {
      setRunning(false);
    }
  }, [away.id, home.id, seed]);

  const shown = match.events.filter((event) => event.minute <= minute);
  const latest = shown.at(-1);
  const liveHome = shown.filter((event) => event.kind === "goal" && event.side === "home").length;
  const liveAway = shown.filter((event) => event.kind === "goal" && event.side === "away").length;
  const ball = latest ?? { x: 50, y: 50, kind: "chance" as const, side: "home" as const };

  useEffect(() => {
    const goalThisMinute = match.events.find(
      (event) => event.kind === "goal" && event.minute === minute,
    );
    if (!goalThisMinute) {
      return;
    }
    const key = `${seed}-${goalThisMinute.minute}-${goalThisMinute.side}-${goalThisMinute.player ?? ""}`;
    if (lastGoalKey.current === key) {
      return;
    }
    lastGoalKey.current = key;
    setFlash(goalThisMinute);
  }, [match.events, minute, seed]);

  useEffect(() => {
    if (!flash) {
      return;
    }
    const hide = window.setTimeout(() => setFlash(null), 2200);
    return () => window.clearTimeout(hide);
  }, [flash]);

  function kickOff() {
    if (minute >= 90) {
      autoPlay.current = true;
      setSeed(Date.now());
      return;
    }
    setRunning(true);
  }

  const interval = MS_PER_MINUTE[speed] ?? 110;
  const seconds = minute >= 90 ? 0 : running ? Math.min(59, Math.floor((tick / interval) * 60)) : 0;
  const clock = `${String(Math.min(minute, 90)).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const liveLabel = minute >= 90 ? "FT · sample" : running ? "Live sample" : minute > 0 ? "Paused sample" : "Ready";

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 text-white">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-black/40 px-4 py-2.5 sm:px-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
          {liveLabel}
        </p>
        <p className="font-mono text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">
          {clock}
        </p>
        <p className="text-[11px] font-medium text-slate-400">90:00 lab clock</p>
      </div>

      <div className="px-4 pt-4 sm:px-5">
        <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-3">
          <ClubChip team={home} score={liveHome} side="Home" align="left" />
          <p className="shrink-0 font-mono text-3xl font-semibold tabular-nums sm:text-4xl">
            {liveHome}–{liveAway}
          </p>
          <ClubChip team={away} score={liveAway} side="Away" align="right" />
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <Pitch
          home={home}
          away={away}
          ball={ball}
          attack={latest?.side ?? null}
          flash={flash}
        />
      </div>

      <p className="min-h-12 px-4 text-sm leading-6 text-emerald-100 sm:px-5" aria-live="polite">
        {minute === 0
          ? "Press kick off. Kit colours are the dots. The clock is this sample, not a real match."
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
            setTick(0);
            setFlash(null);
            lastGoalKey.current = null;
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
        <p className="self-center text-xs text-slate-400">Watch one sample. 300 lab rolls sit below.</p>
      </div>

      {minute >= 90 ? (
        <div className="border-t border-white/10 px-4 py-4 text-sm leading-6 text-slate-300 sm:px-5">
          Full time in this sample: {home.name} {match.finalHome}–{match.finalAway} {away.name}.
          The model used {home.goalsPerGame} and {away.goalsPerGame} goals / game (and how often each
          concedes). This one roll can differ from those averages — luck is part of soccer, and this
          is not a forecast.
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

function ClubChip({
  team,
  score,
  side,
  align,
}: {
  team: LabTeam;
  score: number;
  side: string;
  align: "left" | "right";
}) {
  return (
    <div className={`flex min-w-0 items-center gap-2 ${align === "right" ? "flex-row-reverse text-right" : ""}`}>
      <span
        className="h-8 w-8 shrink-0 rounded-full border border-white/30"
        style={{ background: team.primary }}
        aria-hidden
      />
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{side}</p>
        <p className="truncate text-sm font-semibold text-white">{team.shortName}</p>
        <p className="text-[11px] text-slate-400">{score} so far</p>
      </div>
    </div>
  );
}

function Pitch({
  home,
  away,
  ball,
  attack,
  flash,
}: {
  home: LabTeam;
  away: LabTeam;
  ball: Pick<SimEvent, "x" | "y" | "kind" | "side">;
  attack: "home" | "away" | null;
  flash: SimEvent | null;
}) {
  const awayShape = HOME_SHAPE.map((spot) => ({ x: 100 - spot.x, y: spot.y }));
  const goalSide = flash?.side === "home" ? home : away;

  return (
    <div
      className="relative aspect-[1.7] overflow-hidden rounded-2xl border border-white/10"
      style={{
        background: "repeating-linear-gradient(90deg, #157a3a 0 12.5%, #1b8a44 12.5% 25%)",
      }}
    >
      <div className="absolute inset-2 rounded-lg border-2 border-white/50" />
      <div className="absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-white/50" />
      <div className="absolute left-1/2 top-1/2 h-[22%] w-[14%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/50" />
      <div className="absolute inset-y-[18%] left-2 w-[18%] border-2 border-l-0 border-white/50" />
      <div className="absolute inset-y-[18%] right-2 w-[18%] border-2 border-r-0 border-white/50" />
      <div className="absolute inset-y-[32%] left-2 w-[8%] border-2 border-l-0 border-white/40" />
      <div className="absolute inset-y-[32%] right-2 w-[8%] border-2 border-r-0 border-white/40" />
      <span className="absolute top-2 left-3 rounded bg-black/35 px-1.5 py-0.5 text-[10px] font-semibold">
        Home · {home.shortName}
      </span>
      <span className="absolute top-2 right-3 rounded bg-black/35 px-1.5 py-0.5 text-[10px] font-semibold">
        Away · {away.shortName}
      </span>
      {HOME_SHAPE.map((spot, index) => (
        <KitDot
          key={`h-${index}`}
          x={spot.x + (attack === "home" && spot.x > 40 ? 3 : 0)}
          y={spot.y}
          color={home.primary}
          active={attack === "home"}
        />
      ))}
      {awayShape.map((spot, index) => (
        <KitDot
          key={`a-${index}`}
          x={spot.x - (attack === "away" && spot.x < 60 ? 3 : 0)}
          y={spot.y}
          color={away.primary}
          active={attack === "away"}
        />
      ))}
      <span
        className="absolute z-[1] h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg ring-2 ring-slate-900/40 transition-all duration-300"
        style={{ left: `${ball.x}%`, top: `${ball.y}%` }}
      />
      {flash ? (
        <div className="lab-goal-flash pointer-events-none absolute inset-0 z-[2] flex flex-col items-center justify-center bg-black/35">
          <p
            className="rounded-full px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{
              background: goalSide.primary,
              color: isLightColor(goalSide.primary) ? "#0f172a" : "#fff",
            }}
          >
            Sample goal
          </p>
          <p className="mt-2 text-5xl font-black tracking-tight text-white drop-shadow sm:text-6xl">
            GOAL
          </p>
          <p className="mt-1 text-sm font-medium text-white/90">
            {flash.player ?? goalSide.shortName} · {flash.minute}&apos;
          </p>
        </div>
      ) : null}
    </div>
  );
}

function KitDot({
  x,
  y,
  color,
  active,
}: {
  x: number;
  y: number;
  color: string;
  active: boolean;
}) {
  const light = isLightColor(color);
  return (
    <span
      className={`absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full shadow transition-all duration-300 sm:h-3 sm:w-3 ${
        active ? "scale-125" : "opacity-90"
      }`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        background: color,
        boxShadow: light ? "0 0 0 2px #0f172a" : "0 0 0 2px #fff",
      }}
    />
  );
}
