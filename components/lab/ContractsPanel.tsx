import { namesLikelyMatch } from "@/lib/club-name";
import type { ClubNotes, LabTeam } from "@/lib/lab-types";

function ContractList({ team, notes }: { team: LabTeam; notes: ClubNotes | null }) {
  const rows = notes?.contracts ?? [];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-1 text-base font-semibold text-slate-900">{team.name}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-slate-600">
          No wage or signing length is listed in the public community feed for this club right now.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {rows.map((row) => {
            const matched = team.players.find((player) =>
              namesLikelyMatch(player.name, row.name),
            );
            return (
              <li key={row.name} className="py-2.5">
                <p className="text-sm font-medium text-slate-900">{row.name}</p>
                <p className="text-xs text-slate-500">
                  {[
                    row.position || matched?.positionLabel,
                    row.wage && `wage ${row.wage}`,
                    row.signing && `fee/sign ${row.signing}`,
                    row.signed && `dated ${row.signed}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export function ContractsPanel({
  home,
  away,
  homeNotes,
  awayNotes,
}: {
  home: LabTeam;
  away: LabTeam;
  homeNotes: ClubNotes | null;
  awayNotes: ClubNotes | null;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-slate-600">
        {homeNotes?.note ?? awayNotes?.note ?? "Loading community wage notes…"} Fantasy prices on
        the player list are a game mechanic, not take-home pay or contract length.
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        <ContractList team={home} notes={homeNotes} />
        <ContractList team={away} notes={awayNotes} />
      </div>
    </div>
  );
}
