import { Card } from "@/components/Card";
import type { HistoryRow } from "@/types/match";

export function PredictionHistory({ rows }: { rows: HistoryRow[] }) {
  return (
    <Card id="history" className="scroll-mt-20 overflow-hidden p-0">
      <div className="border-b border-white/8 px-5 py-5 sm:px-6">
        <h2 className="text-lg font-semibold text-white">Prediction history</h2>
        <p className="mt-1 text-sm text-slate-400">
          Example past calls used to sketch the accuracy tracker.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="text-xs tracking-wide text-slate-500 uppercase">
            <tr className="border-b border-white/8">
              <th className="px-5 py-3 font-medium sm:px-6">Match</th>
              <th className="px-3 py-3 font-medium">Prediction</th>
              <th className="px-3 py-3 font-medium">Actual result</th>
              <th className="px-5 py-3 font-medium sm:px-6">Correct?</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.match}
                className="border-b border-white/6 last:border-0 hover:bg-white/[0.03]"
              >
                <td className="px-5 py-3.5 text-white sm:px-6">{row.match}</td>
                <td className="px-3 py-3.5 text-slate-300">{row.prediction}</td>
                <td className="px-3 py-3.5 text-slate-300">{row.actual}</td>
                <td className="px-5 py-3.5 font-medium sm:px-6">
                  {row.correct ? (
                    <span className="text-emerald-400">✓</span>
                  ) : (
                    <span className="text-rose-400">✕</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
