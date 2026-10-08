import type { LabPlayer, LabTeam } from "@/lib/lab-types";

export function starPlayer(
  team: LabTeam,
  key: "goals" | "assists" | "xg" | "minutes",
  skipId?: number,
) {
  return [...team.players]
    .filter((player) => player.minutes > 0 && player.id !== skipId)
    .sort((a, b) => b[key] - a[key])[0] as LabPlayer | undefined;
}

export function starterAt(team: LabTeam, position: LabPlayer["position"]) {
  return [...team.players]
    .filter((player) => player.position === position && player.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes)[0] as LabPlayer | undefined;
}

function Face({
  player,
  team,
  face,
}: {
  player: LabPlayer;
  team: LabTeam;
  face: "left" | "right";
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2">
      <div
        className="h-24 w-[4.5rem] overflow-hidden rounded-2xl sm:h-36 sm:w-28"
        style={{ background: team.secondary, boxShadow: `inset 0 0 0 3px ${team.primary}` }}
      >
        <img
          src={player.photo}
          alt={`${player.webName} of ${team.name}`}
          className={`h-full w-full object-cover object-top ${face === "right" ? "-scale-x-100" : ""}`}
        />
      </div>
      <div className="w-full min-w-0 text-center">
        <p className="truncate text-xs font-semibold text-slate-900 sm:text-sm">{player.webName}</p>
        <p className="hidden text-[11px] text-slate-500 sm:block">{player.positionLabel}</p>
        <p className="text-[11px] text-slate-600">
          {player.goals}g · {player.assists}a
        </p>
      </div>
    </div>
  );
}

export function FaceOff({ home, away }: { home: LabTeam; away: LabTeam }) {
  const pairs = [
    {
      label: "Goalkeepers",
      hint: "The last line of defence.",
      left: starterAt(home, "GK"),
      right: starterAt(away, "GK"),
    },
    {
      label: "Main scorers",
      hint: "Who has put the ball in the net most.",
      left: starPlayer(home, "goals"),
      right: starPlayer(away, "goals"),
    },
    {
      label: "Chance makers",
      hint: "Who has set up teammates most.",
      left: starPlayer(home, "assists", starPlayer(home, "goals")?.id),
      right: starPlayer(away, "assists", starPlayer(away, "goals")?.id),
    },
  ].filter((pair) => pair.left && pair.right);

  if (pairs.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Players facing off</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">
        Home on the left, away on the right. Same job, opposite shirts.
      </p>
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        <p className="text-center">Home</p>
        <p />
        <p className="text-center">Away</p>
      </div>
      <div className="mt-5 space-y-6">
        {pairs.map((pair) => (
          <div key={pair.label}>
            <p className="text-sm font-medium text-slate-900">{pair.label}</p>
            <p className="text-xs text-slate-500">{pair.hint}</p>
            <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
              <Face player={pair.left!} team={home} face="left" />
              <p className="text-[11px] font-semibold tracking-wide text-slate-400">VS</p>
              <Face player={pair.right!} team={away} face="right" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
