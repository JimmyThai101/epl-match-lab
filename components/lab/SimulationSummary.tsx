"use client";

import { useMemo, useState } from "react";
import type { LabTeam } from "@/lib/lab-types";
import { summarizeSimulations } from "@/lib/simulate-match";

export function SimulationSummary({ home, away }: { home: LabTeam; away: LabTeam }) {
  const [samples, setSamples] = useState(500);
  const summary = useMemo(
    () => summarizeSimulations(home, away, samples, 17),
    [away, home, samples],
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <h2 className="text-lg font-semibold text-slate-900">Explore many samples</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">
        These percentages are from this site&apos;s simplified model (season scoring and conceding
        rates). They are not a validated real-world forecast.
      </p>
      <div className="mt-3 flex gap-2">
        {[200, 500, 1500].map((count) => (
          <button
            key={count}
            type="button"
            onClick={() => setSamples(count)}
            className={`min-h-11 rounded-full px-3 py-2 text-sm ${
              samples === count ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            {count} rolls
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <Outcome label={`${home.shortName} win`} value={summary.homeWins} total={summary.samples} color={home.primary} />
        <Outcome label="Draw" value={summary.draws} total={summary.samples} color="#94a3b8" />
        <Outcome label={`${away.shortName} win`} value={summary.awayWins} total={summary.samples} color={away.primary} />
      </div>
      <p className="mt-4 text-sm text-slate-600">
        Average sample score {summary.avgHome}–{summary.avgAway} (inputs {home.goalsPerGame} and{" "}
        {away.goalsPerGame} goals / game).
      </p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Most common scorelines</p>
      <ul className="mt-2 space-y-1 text-sm text-slate-700">
        {summary.topScores.map((row) => (
          <li key={row.score}>
            {row.score} · {Math.round((row.count / summary.samples) * 100)}%
          </li>
        ))}
      </ul>
    </section>
  );
}

function Outcome({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = Math.round((value / total) * 100);
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{pct}%</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
        <span className="block h-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
