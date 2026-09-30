import { Card } from "@/components/Card";
import { FormPills } from "@/components/FormPills";
import type { TeamProfile } from "@/types/match";

export function RecentForm({
  home,
  away,
}: {
  home: TeamProfile;
  away: TeamProfile;
}) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-white">Recent form</h2>
      <p className="mt-1 text-sm text-slate-400">Last five matches, newest on the right.</p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <FormCard team={home} />
        <FormCard team={away} />
      </div>
    </Card>
  );
}

function FormCard({ team }: { team: TeamProfile }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium text-white">{team.name}</p>
        <FormPills form={team.form} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-slate-500">Goals scored</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-white">
            {team.goalsScoredLast5}
          </p>
        </div>
        <div>
          <p className="text-slate-500">Goals conceded</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-white">
            {team.goalsConcededLast5}
          </p>
        </div>
      </div>
    </div>
  );
}
