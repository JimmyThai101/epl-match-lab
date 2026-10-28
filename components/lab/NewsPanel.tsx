import type { LabPlayer, LabTeam } from "@/lib/lab-types";
import { statusLabel } from "@/lib/format";
import { groupTeamNews, type Availability, type NewsPlayer } from "@/lib/team-news";

const BUCKETS: { id: Availability; title: string; empty: string }[] = [
  { id: "out", title: "Out", empty: "Nobody flagged out." },
  { id: "doubtful", title: "Doubtful", empty: "Nobody flagged doubtful." },
  { id: "available", title: "Available", empty: "No available names in this squad." },
];

export function NewsPanel({
  home,
  away,
  onOpenScout,
}: {
  home: LabTeam;
  away: LabTeam;
  onOpenScout: (player: LabPlayer) => void;
}) {
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:px-5">
        <h2 className="text-base font-semibold text-slate-900">Team news</h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          FPL status and chance of playing next round for the two clubs you picked. Blank news stays blank. This is not a confirmed team sheet.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ClubNews team={home} side="Home" onOpenScout={onOpenScout} />
        <ClubNews team={away} side="Away" onOpenScout={onOpenScout} />
      </div>
    </section>
  );
}

function ClubNews({
  team,
  side,
  onOpenScout,
}: {
  team: LabTeam;
  side: string;
  onOpenScout: (player: LabPlayer) => void;
}) {
  const groups = groupTeamNews(team.players);
  const byId = new Map(team.players.map((player) => [player.id, player]));

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <header
        className="flex items-center gap-3 border-b border-slate-100 px-4 py-4"
        style={{ boxShadow: `inset 4px 0 0 ${team.primary}` }}
      >
        <img src={team.badge} alt="" className="h-10 w-10 object-contain" />
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{side}</p>
          <h3 className="text-base font-semibold text-slate-900">{team.name}</h3>
        </div>
      </header>
      <div className="space-y-4 px-4 py-4">
        {BUCKETS.map((bucket) => {
          const players = groups[bucket.id];
          return (
            <div key={bucket.id}>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {bucket.title} · {players.length}
              </p>
              {players.length === 0 ? (
                <p className="mt-1 text-sm text-slate-400">{bucket.empty}</p>
              ) : bucket.id === "available" ? (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {players.map((player) => (
                    <li key={player.id}>
                      <ScoutChip player={byId.get(player.id)} label={player.webName} onOpenScout={onOpenScout} />
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-2 space-y-2">
                  {players.map((player) => (
                    <FlaggedRow
                      key={player.id}
                      player={player}
                      full={byId.get(player.id)}
                      onOpenScout={onOpenScout}
                    />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </article>
  );
}

function FlaggedRow({
  player,
  full,
  onOpenScout,
}: {
  player: NewsPlayer;
  full: LabPlayer | undefined;
  onOpenScout: (player: LabPlayer) => void;
}) {
  return (
    <li className="rounded-xl bg-slate-50 px-3 py-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{player.webName}</p>
          <p className="text-[11px] text-slate-500">
            {statusLabel(player.status)}
            {player.chanceNext === null ? "" : ` · ${player.chanceNext}% next round`}
          </p>
          {player.news ? <p className="mt-1 text-xs leading-5 text-slate-600">{player.news}</p> : null}
        </div>
        {full ? <ScoutChip player={full} label="Scout" onOpenScout={onOpenScout} /> : null}
      </div>
    </li>
  );
}

function ScoutChip({
  player,
  label,
  onOpenScout,
}: {
  player: LabPlayer | undefined;
  label: string;
  onOpenScout: (player: LabPlayer) => void;
}) {
  if (!player) {
    return <span className="text-sm text-slate-700">{label}</span>;
  }
  return (
    <button
      type="button"
      onClick={() => onOpenScout(player)}
      className="min-h-9 rounded-full bg-white px-3 py-1 text-sm text-slate-800 ring-1 ring-slate-200 hover:bg-slate-100"
    >
      {label}
    </button>
  );
}
