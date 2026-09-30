import { Card } from "@/components/Card";
import { StatRow } from "@/components/StatRow";
import type { MatchDashboard } from "@/types/match";

export function MatchOverview({ match }: { match: MatchDashboard }) {
  return (
    <Card id="overview" className="scroll-mt-20 p-5 sm:p-6">
      <div className="mb-2 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Match overview</h2>
          <p className="mt-1 text-sm text-slate-400">
            Season-to-date rates, shown side by side.
          </p>
        </div>
        <div className="hidden text-xs font-medium tracking-wide text-slate-500 uppercase sm:flex sm:gap-8">
          <span style={{ color: match.home.accent }}>{match.home.shortName}</span>
          <span style={{ color: match.away.accent }}>{match.away.shortName}</span>
        </div>
      </div>

      <div className="divide-y divide-white/6">
        {match.comparisons.map((stat) => (
          <StatRow
            key={stat.id}
            stat={stat}
            homeColor={match.home.accent}
            awayColor={match.away.accent}
          />
        ))}
      </div>
    </Card>
  );
}
