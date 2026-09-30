import { Card } from "@/components/Card";
import { ProbabilityBars } from "@/components/ProbabilityBars";
import type { MatchDashboard } from "@/types/match";

export function PredictionPanel({ match }: { match: MatchDashboard }) {
  const { prediction, home, away } = match;

  return (
    <Card
      id="prediction"
      className="scroll-mt-20 border-emerald-400/15 bg-[linear-gradient(180deg,rgba(16,185,129,0.08),transparent_42%),#11161f] p-5 sm:p-6"
    >
      <p className="text-xs font-medium tracking-[0.2em] text-emerald-300/80 uppercase">
        Demonstration only
      </p>
      <h2 className="mt-2 text-lg font-semibold text-white">Predicted result</h2>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-white">
        {prediction.label}
      </p>
      <p className="mt-3 text-sm text-slate-400">
        This is a demonstration prediction using mock data, not a real betting
        prediction.
      </p>

      <p className="mt-6 text-center text-4xl font-semibold tabular-nums text-white">
        {home.shortName} {prediction.homeGoals}
        <span className="mx-2 text-slate-500">-</span>
        {prediction.awayGoals} {away.shortName}
      </p>

      <div className="mt-6">
        <ProbabilityBars
          homeLabel={home.name}
          awayLabel={away.name}
          homeWinPct={prediction.homeWinPct}
          drawPct={prediction.drawPct}
          awayWinPct={prediction.awayWinPct}
          homeColor={home.accent}
          awayColor={away.accent}
        />
      </div>

      <p className="mt-5 text-sm text-slate-400">{prediction.explanation}</p>
    </Card>
  );
}
