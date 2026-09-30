import { Card } from "@/components/Card";
import { formatStat } from "@/lib/compare";
import type { TeamProfile } from "@/types/match";

export function HomeVsAway({
  home,
  away,
}: {
  home: TeamProfile;
  away: TeamProfile;
}) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-white">Home vs away</h2>
      <p className="mt-1 text-sm text-slate-400">
        Split record for this venue context, not overall season averages.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <SplitCard team={home} />
        <SplitCard team={away} />
      </div>
    </Card>
  );
}

function SplitCard({ team }: { team: TeamProfile }) {
  const rows = [
    { label: "Goals/game", value: formatStat(team.split.goalsPerGame, "number") },
    { label: "xG", value: formatStat(team.split.xG, "number") },
    { label: "Shots", value: formatStat(team.split.shotsPerGame, "number") },
    { label: "Possession", value: formatStat(team.split.possession, "percent") },
    { label: "Win percentage", value: formatStat(team.split.winPercentage, "percent") },
  ];

  return (
    <div
      className="rounded-xl border bg-[#0c1017] p-4"
      style={{ borderColor: `${team.accent}40` }}
    >
      <p className="text-xs font-medium tracking-widest text-slate-500 uppercase">
        {team.split.label}
      </p>
      <p className="mt-1 text-xl font-semibold text-white">{team.name}</p>
      <dl className="mt-4 space-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between text-sm">
            <dt className="text-slate-400">{row.label}</dt>
            <dd className="font-medium tabular-nums text-white">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
