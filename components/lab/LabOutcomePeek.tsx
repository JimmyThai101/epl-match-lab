"use client";

import { useMemo } from "react";
import type { LabTeam } from "@/lib/lab-types";
import { summarizeSimulations } from "@/lib/simulate-match";

export function LabOutcomePeek({ home, away }: { home: LabTeam; away: LabTeam }) {
  const summary = useMemo(() => summarizeSimulations(home, away, 300, 5), [away, home]);
  const rows = [
    { label: `${home.shortName} win`, n: summary.homeWins, color: home.primary },
    { label: "Draw", n: summary.draws, color: "#94a3b8" },
    { label: `${away.shortName} win`, n: summary.awayWins, color: away.primary },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-900">Lab match rolls</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">
        300 samples from season scoring and conceding rates, with a small home-left setup. Not
        XGBoost, not a tip, not tested as a real predictor. Open Play for the pitch and more rolls.
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {rows.map((row) => {
          const pct = Math.round((row.n / summary.samples) * 100);
          return (
            <div key={row.label} className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">{row.label}</p>
              <p className="text-xl font-semibold text-slate-900">{pct}%</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <span className="block h-full" style={{ width: `${pct}%`, background: row.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
