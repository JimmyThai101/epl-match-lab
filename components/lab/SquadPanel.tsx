"use client";

import { useMemo, useState } from "react";
import type { LabPlayer, LabTeam } from "@/lib/lab-types";
import { statusLabel } from "@/lib/format";
import { isStandout, watchTag, type WatchTag } from "@/lib/watch";

function PlayerRow({ player, tag }: { player: LabPlayer; tag: WatchTag | null }) {
  return (
    <details className="border-b border-slate-100 last:border-0">
      <summary className="flex cursor-pointer list-none items-start gap-3 px-3 py-2.5 hover:bg-slate-50">
        <img
          src={player.photo}
          alt=""
          className="h-10 w-8 rounded object-cover bg-slate-100"
        />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-900">
            <span className="truncate">{player.webName}</span>
            {tag ? (
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${tag.className}`}>
                {tag.label}
              </span>
            ) : null}
          </p>
          <p className="text-[11px] text-slate-500">
            {player.starts} starts · {player.goals} goals · {player.assists} assists
          </p>
          {player.news ? (
            <p className="mt-1 text-[11px] text-slate-600">{player.news}</p>
          ) : (
            <p className="mt-1 text-[11px] text-slate-400">{statusLabel(player.status)}</p>
          )}
        </div>
        <p className="text-[11px] text-slate-400" title="Fantasy game price, not a real salary">
          FPL {player.fplPrice}
        </p>
      </summary>
      <div className="grid grid-cols-2 gap-2 px-3 pb-3 text-[11px] text-slate-600 sm:grid-cols-4">
        <p>Minutes {player.minutes}</p>
        <p>xG {player.xg}</p>
        <p>xA {player.xa}</p>
        <p>Clean sheets {player.cleanSheets}</p>
        <p>Yellow {player.yellowCards}</p>
        <p>Red {player.redCards}</p>
        <p>Bonus {player.bonus}</p>
        <p>FPL pts/game {player.pointsPerGame}</p>
        <p>Picked by {player.selectedBy}</p>
        <p>Next chance {player.chanceNext === null ? "n/a" : `${player.chanceNext}%`}</p>
      </div>
    </details>
  );
}

function SquadList({ team }: { team: LabTeam }) {
  const [query, setQuery] = useState("");
  const [onlyConcerns, setOnlyConcerns] = useState(false);
  const groups = ["GK", "DEF", "MID", "FWD"] as const;

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return team.players.filter((player) => {
      if (player.minutes <= 0 && !needle && !onlyConcerns) {
        return false;
      }
      if (needle && !`${player.webName} ${player.name}`.toLowerCase().includes(needle)) {
        return false;
      }
      if (onlyConcerns && !watchTag(player, isStandout(player, team.players))) {
        return false;
      }
      return true;
    });
  }, [onlyConcerns, query, team.players]);

  const watch = team.players
    .map((player) => ({ player, tag: watchTag(player, isStandout(player, team.players)) }))
    .filter((item): item is { player: LabPlayer; tag: WatchTag } => item.tag !== null);

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-5"
      style={{ boxShadow: `inset 0 4px 0 ${team.primary}` }}
    >
      <h3 className="mb-1 flex items-center gap-2 text-base font-semibold text-slate-900">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: team.primary }} />
        {team.name} squad
      </h3>
      <p className="mb-3 text-xs text-slate-500">
        Tap a name for extra counting stats. FPL prices are a game, not salaries.
      </p>
      {watch.length > 0 ? (
        <ul className="mb-3 flex flex-wrap gap-1.5">
          {watch.map(({ player, tag }) => (
            <li
              key={player.id}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${tag.className}`}
            >
              {player.webName} · {tag.label}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a player"
          className="min-h-12 w-full rounded-xl border border-slate-200 px-3 py-3 text-base outline-none ring-emerald-500/30 focus:ring-2 sm:min-h-10 sm:py-2 sm:text-sm"
        />
        <label className="flex items-center gap-2 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={onlyConcerns}
            onChange={(event) => setOnlyConcerns(event.target.checked)}
          />
          Watch list only
        </label>
      </div>
      <div className="space-y-4">
        {groups.map((group) => {
          const rows = filtered.filter((player) => player.position === group);
          if (rows.length === 0) {
            return null;
          }
          return (
            <div key={group}>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                {rows[0].positionLabel}
              </p>
              <div className="rounded-xl border border-slate-100">
                {rows.map((player) => (
                  <PlayerRow
                    key={player.id}
                    player={player}
                    tag={watchTag(player, isStandout(player, team.players))}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function SquadPanel({ home, away }: { home: LabTeam; away: LabTeam }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <SquadList team={home} />
      <SquadList team={away} />
    </div>
  );
}
