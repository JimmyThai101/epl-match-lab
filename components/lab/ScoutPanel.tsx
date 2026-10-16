"use client";

import { useMemo, useState } from "react";
import type { LabTeam, Position } from "@/lib/lab-types";
import {
  allScoutedPlayers,
  clusterPlayers,
  labIndex,
  searchPlayers,
  similarPlayers,
  type ScoutedPlayer,
} from "@/lib/scout";

export function ScoutPanel({ teams }: { teams: LabTeam[] }) {
  const pool = useMemo(() => allScoutedPlayers(teams), [teams]);
  const styles = useMemo(() => clusterPlayers(pool), [pool]);
  const [query, setQuery] = useState("Saka");
  const [position, setPosition] = useState<Position | "ALL">("ALL");
  const [pickedId, setPickedId] = useState<number | null>(null);

  const hits = useMemo(() => searchPlayers(pool, query, position).slice(0, 12), [pool, position, query]);
  const picked =
    pool.find((player) => player.id === pickedId) ??
    hits[0] ??
    pool.find((player) => player.webName.toLowerCase() === "saka") ??
    pool[0];
  const neighbours = picked ? similarPlayers(picked, pool) : [];
  const style = picked ? styles.get(picked.id) : undefined;
  const index = picked ? labIndex(picked) : 0;

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-slate-900">Scout</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Find players with similar counting stats this season (goals, assists, xG, xA, minutes).
          This is not a full scouting report — FPL has no dribbles or passing %. Lab index is a
          homemade score, not a transfer fee.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">Search the league</span>
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPickedId(null);
              }}
              placeholder="Saka, Haaland…"
              className="min-h-12 w-full rounded-xl border border-slate-200 px-3 py-3 text-base outline-none focus:ring-2 sm:text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">Position</span>
            <select
              value={position}
              onChange={(event) => setPosition(event.target.value as Position | "ALL")}
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base sm:text-sm"
            >
              <option value="ALL">All</option>
              <option value="GK">GK</option>
              <option value="DEF">DEF</option>
              <option value="MID">MID</option>
              <option value="FWD">FWD</option>
            </select>
          </label>
        </div>
        <ul className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-100">
          {hits.map((player) => (
            <li key={player.id}>
              <button
                type="button"
                onClick={() => setPickedId(player.id)}
                className={`flex w-full min-h-12 items-center gap-3 px-3 py-2 text-left text-sm ${
                  picked?.id === player.id ? "bg-slate-50" : "hover:bg-slate-50"
                }`}
              >
                <img src={player.photo} alt="" className="h-10 w-8 rounded object-cover bg-slate-100" />
                <span className="min-w-0 flex-1">
                  <span className="font-semibold text-slate-900">{player.webName}</span>
                  <span className="block text-[11px] text-slate-500">
                    {player.club} · {player.positionLabel}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {picked ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <img src={picked.photo} alt="" className="h-20 w-16 rounded-xl object-cover bg-slate-100" />
            <div>
              <h3 className="text-xl font-semibold text-slate-900">{picked.webName}</h3>
              <p className="text-sm text-slate-600">
                {picked.club} · {picked.positionLabel} · {picked.goals}g · {picked.assists}a · xG {picked.xg}
              </p>
              <p className="mt-2 text-sm text-slate-700">
                Style group: <strong>{style?.label ?? "Too few minutes to cluster"}</strong>
                {style ? ` — ${style.meaning}` : ""}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Lab index {index} (stat score per 90). Fantasy game price {picked.fplPrice} — not a
                real wage or transfer fee. We do not have listed sale prices in this feed.
              </p>
            </div>
          </div>

          <h4 className="mt-5 text-sm font-semibold text-slate-900">Closest statistical matches</h4>
          <ul className="mt-2 space-y-2">
            {neighbours.map(({ player, distance, samePosition }) => (
              <li key={player.id}>
                <button
                  type="button"
                  onClick={() => {
                    setQuery(player.webName);
                    setPickedId(player.id);
                  }}
                  className="flex w-full min-h-11 items-center justify-between gap-3 rounded-xl border border-slate-100 px-3 py-2 text-left text-sm hover:bg-slate-50"
                >
                  <span>
                    <span className="font-medium text-slate-900">{player.webName}</span>
                    <span className="text-slate-500">
                      {" "}
                      · {player.clubShort} · {player.position}
                      {samePosition ? "" : " (other position)"}
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-400">gap {distance.toFixed(2)}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
