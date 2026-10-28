import type { LabPlayer, LeagueSnapshot } from "@/lib/lab-types";
import { seasonScorers } from "@/lib/scorers";

export function ScorersPanel({
  data,
  homeId,
  awayId,
  onOpenScout,
}: {
  data: LeagueSnapshot;
  homeId: number;
  awayId: number;
  onOpenScout: (player: LabPlayer) => void;
}) {
  const rows = seasonScorers(data.teams);
  const players = new Map(
    data.teams.flatMap((team) => team.players.map((player) => [player.id, player] as const)),
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
        <h2 className="text-base font-semibold text-slate-900">Scorers</h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          FPL season totals: goals, then assists, then xG. Game stats, not a valuation. Tap a name to open Scout.
        </p>
      </div>
      <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
        <table className="min-w-[36rem] w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">#</th>
              <th className="px-4 py-2 font-medium">Player</th>
              <th className="px-4 py-2 font-medium">Club</th>
              <th className="px-4 py-2 font-medium">Goals</th>
              <th className="px-4 py-2 font-medium">Assists</th>
              <th className="px-4 py-2 font-medium">xG</th>
              <th className="px-4 py-2 font-medium">Mins</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const selected = row.teamId === homeId || row.teamId === awayId;
              const player = players.get(row.id);
              return (
                <tr key={row.id} className={selected ? "bg-slate-50" : "odd:bg-white even:bg-slate-50/40"}>
                  <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                  <td className="px-4 py-3">
                    {player ? (
                      <button
                        type="button"
                        onClick={() => onOpenScout(player)}
                        className="min-h-11 text-left font-semibold text-slate-900 hover:underline"
                      >
                        {row.webName}
                      </button>
                    ) : (
                      row.webName
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2">
                      <img src={row.badge} alt="" className="h-6 w-6 object-contain" />
                      {row.teamShort}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{row.goals}</td>
                  <td className="px-4 py-3">{row.assists}</td>
                  <td className="px-4 py-3">{row.xg}</td>
                  <td className="px-4 py-3 text-slate-500">{row.minutes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
