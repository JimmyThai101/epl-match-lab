import type { LeagueSnapshot } from "@/lib/lab-types";
import { FormPills } from "@/components/lab/LabBits";

export function TablePanel({
  data,
  homeId,
  awayId,
  onPick,
}: {
  data: LeagueSnapshot;
  homeId: number;
  awayId: number;
  onPick: (id: number) => void;
}) {
  const names = new Map(data.teams.map((team) => [team.id, team]));

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
        <h2 className="text-base font-semibold text-slate-900">League table</h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Swipe sideways to see form. Tap a club to load it as home (left).
        </p>
      </div>
      <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
        <table className="min-w-[36rem] w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">#</th>
              <th className="px-4 py-2 font-medium">Club</th>
              <th className="px-4 py-2 font-medium">P</th>
              <th className="px-4 py-2 font-medium">W</th>
              <th className="px-4 py-2 font-medium">D</th>
              <th className="px-4 py-2 font-medium">L</th>
              <th className="px-4 py-2 font-medium">GD</th>
              <th className="px-4 py-2 font-medium">Pts</th>
              <th className="px-4 py-2 font-medium">Form</th>
            </tr>
          </thead>
          <tbody>
            {data.table.map((row) => {
              const team = names.get(row.teamId);
              if (!team) {
                return null;
              }
              const selected = row.teamId === homeId || row.teamId === awayId;
              return (
                <tr
                  key={row.teamId}
                  className={selected ? "bg-slate-50" : "odd:bg-white even:bg-slate-50/40"}
                  style={
                    selected
                      ? { boxShadow: `inset 4px 0 0 ${team.primary}` }
                      : undefined
                  }
                >
                  <td className="px-3 py-3 text-slate-500 sm:px-4">{row.position}</td>
                  <td className="px-3 py-3 sm:px-4">
                    <button
                      type="button"
                      onClick={() => onPick(row.teamId)}
                      className="flex min-h-12 items-center gap-3 text-left text-base font-semibold text-slate-900 hover:underline"
                    >
                      <img src={team.badge} alt="" className="h-10 w-10 object-contain" />
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: team.primary }}
                      />
                      {team.name}
                    </button>
                  </td>
                  <td className="px-4 py-2">{row.played}</td>
                  <td className="px-4 py-2">{row.won}</td>
                  <td className="px-4 py-2">{row.drawn}</td>
                  <td className="px-4 py-2">{row.lost}</td>
                  <td className="px-4 py-2">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                  <td className="px-4 py-2 font-semibold">{row.points}</td>
                  <td className="px-4 py-2">
                    <FormPills form={row.form} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
