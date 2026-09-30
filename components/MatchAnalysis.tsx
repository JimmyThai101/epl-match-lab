import { Card } from "@/components/Card";
import type { MatchDashboard } from "@/types/match";

export function MatchAnalysis({ match }: { match: MatchDashboard }) {
  return (
    <Card id="analysis" className="scroll-mt-20 p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-white">Match Analysis</h2>
      <p className="mt-1 text-sm text-slate-400">
        Short reads from the mock table above. Not live Opta or club data.
      </p>

      <ul className="mt-5 space-y-3">
        {match.observations.map((line) => (
          <li
            key={line}
            className="flex gap-3 rounded-lg border border-white/6 bg-white/[0.02] px-3 py-3 text-sm leading-6 text-slate-200"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            {line}
          </li>
        ))}
      </ul>
    </Card>
  );
}
