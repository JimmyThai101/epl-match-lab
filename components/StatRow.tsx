import { barShare, formatStat, hasAdvantage } from "@/lib/compare";
import type { ComparisonStat } from "@/types/match";

type StatRowProps = {
  stat: ComparisonStat;
  homeColor: string;
  awayColor: string;
};

export function StatRow({ stat, homeColor, awayColor }: StatRowProps) {
  const leader = hasAdvantage(stat.home, stat.away, stat.higherIsBetter);
  const homeShare = barShare(stat.home, stat.away);
  const awayShare = 100 - homeShare;

  return (
    <div className="grid grid-cols-1 items-center gap-2 py-3 sm:grid-cols-[1fr_9.5rem_1fr] sm:gap-4">
      <div className="order-2 sm:order-1">
        <p
          className={`text-right text-lg font-semibold tabular-nums ${
            leader === "home" ? "text-white" : "text-slate-400"
          }`}
        >
          {formatStat(stat.home, stat.format)}
        </p>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/8">
          <div
            className="ml-auto h-full rounded-full"
            style={{ width: `${homeShare}%`, backgroundColor: homeColor }}
          />
        </div>
      </div>

      <p className="order-1 text-center text-xs font-medium tracking-wide text-slate-400 uppercase sm:order-2">
        {stat.label}
      </p>

      <div className="order-3">
        <p
          className={`text-left text-lg font-semibold tabular-nums ${
            leader === "away" ? "text-white" : "text-slate-400"
          }`}
        >
          {formatStat(stat.away, stat.format)}
        </p>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full"
            style={{ width: `${awayShare}%`, backgroundColor: awayColor }}
          />
        </div>
      </div>
    </div>
  );
}
