"use client";

import { useMemo, useState } from "react";
import type { LabTeam, Position } from "@/lib/lab-types";
import { kitForClub } from "@/lib/kit-colors";
import {
  allScoutedPlayers,
  clusterPlayers,
  labIndex,
  searchPlayers,
  sameStylePlayers,
  similarPlayers,
  type ScoutedPlayer,
} from "@/lib/scout";
import { barWidths, radarPoint, radarPolygon } from "@/lib/scout-compare";

export function ScoutPanel({
  teams,
  query,
  pickedId,
  compareId,
  onQueryChange,
  onPick,
  onCompare,
}: {
  teams: LabTeam[];
  query: string;
  pickedId: number | null;
  compareId: number | null;
  onQueryChange: (value: string) => void;
  onPick: (player: ScoutedPlayer) => void;
  onCompare: (player: ScoutedPlayer | null) => void;
}) {
  const pool = useMemo(() => allScoutedPlayers(teams), [teams]);
  const styles = useMemo(() => clusterPlayers(pool), [pool]);
  const [position, setPosition] = useState<Position | "ALL">("ALL");
  const [compareQuery, setCompareQuery] = useState("");

  const hits = useMemo(() => searchPlayers(pool, query, position).slice(0, 8), [pool, position, query]);
  const compareHits = useMemo(
    () => searchPlayers(pool, compareQuery, position).slice(0, 8),
    [compareQuery, pool, position],
  );
  const picked =
    pool.find((player) => player.id === pickedId) ??
    pool.find((player) => player.webName.toLowerCase() === query.trim().toLowerCase()) ??
    pool.find((player) => player.webName.toLowerCase() === "saka") ??
    null;
  const other =
    (compareId ? pool.find((player) => player.id === compareId) : null) ??
    (compareQuery.trim()
      ? pool.find((player) => player.webName.toLowerCase() === compareQuery.trim().toLowerCase()) ??
        null
      : null);
  const neighbours = picked ? similarPlayers(picked, pool) : [];
  const styleMates = picked ? sameStylePlayers(picked, pool, styles) : [];

  function pickFromBox(
    text: string,
    list: ScoutedPlayer[],
    assign: (player: ScoutedPlayer) => void,
  ) {
    const needle = text.trim().toLowerCase();
    const exact = pool.find((player) => player.webName.toLowerCase() === needle);
    const next = exact ?? list[0];
    if (next) {
      assign(next);
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-slate-900">Scout</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Type a name in either box, then press Enter. Left is Player A, right is Player B. You can
          still tap a name under a box if you prefer.
        </p>
        <label className="mt-4 block max-w-xs">
          <span className="mb-1 block text-xs font-medium text-slate-500">Position filter</span>
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
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <NameBox
            label="Player A (left)"
            value={query}
            onChange={onQueryChange}
            onEnter={() => pickFromBox(query, hits, onPick)}
            hits={hits}
            activeId={picked?.id ?? null}
            onChoose={onPick}
          />
          <NameBox
            label="Player B (right)"
            value={compareQuery}
            onChange={setCompareQuery}
            onEnter={() => pickFromBox(compareQuery, compareHits, onCompare)}
            hits={compareHits}
            activeId={other?.id ?? null}
            onChoose={(player) => {
              setCompareQuery(player.webName);
              onCompare(player);
            }}
            emptyHint="Type a second name, e.g. Haaland, then Enter."
          />
        </div>
      </section>

      {picked ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <PlayerCard player={picked} label="Player A" style={styles.get(picked.id)} />
            {other ? (
              <PlayerCard
                player={other}
                label="Player B"
                style={styles.get(other.id)}
                onClear={() => {
                  setCompareQuery("");
                  onCompare(null);
                }}
              />
            ) : (
              <div className="flex min-h-40 items-center rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                Type in the Player B box and press Enter.
              </div>
            )}
          </div>
          {other ? <StatCompare left={picked} right={other} /> : null}

          {styleMates.length > 0 && picked ? (
            <div className="mt-5">
              <h4 className="text-sm font-semibold text-slate-900">
                Same style as {picked.webName}
                {styles.get(picked.id) ? ` · ${styles.get(picked.id)?.label}` : ""}
              </h4>
              <p className="mt-1 text-sm text-slate-600">
                Other players in that cluster. Use as B to put one on the right.
              </p>
              <ul className="mt-2 space-y-2">
                {styleMates.map((player) => (
                  <li
                    key={player.id}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 p-2"
                  >
                    <img src={player.photo} alt="" className="h-10 w-8 rounded object-cover bg-slate-100" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900">{player.webName}</p>
                      <p className="text-[11px] text-slate-500">
                        {player.clubShort} · {player.position} · index {labIndex(player)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCompareQuery(player.webName);
                        onCompare(player);
                      }}
                      className="shrink-0 min-h-11 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Use as B
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {neighbours.length > 0 ? (
            <>
              <h4 className="mt-5 text-sm font-semibold text-slate-900">Closest to {picked.webName}</h4>
              <p className="mt-1 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-950">
                Press the dark <strong>Use as B</strong> button to put them on the right and compare.
              </p>
              <ul className="mt-2 space-y-2">
                {neighbours.map(({ player, distance, samePosition }) => (
                  <li key={player.id} className="flex items-center gap-2 rounded-xl border border-slate-200 p-2">
                    <div className="min-w-0 flex-1 px-1">
                      <p className="truncate font-medium text-slate-900">{player.webName}</p>
                      <p className="text-[11px] text-slate-500">
                        {player.clubShort} · {player.position}
                        {samePosition ? "" : " · other position"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCompareQuery(player.webName);
                        onCompare(player);
                      }}
                      className="shrink-0 min-h-11 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Use as B
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      ) : (
        <p className="text-sm text-slate-500">Type a player in the left box and press Enter.</p>
      )}
    </div>
  );
}

function NameBox({
  label,
  value,
  onChange,
  onEnter,
  hits,
  activeId,
  onChoose,
  emptyHint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onEnter: () => void;
  hits: ScoutedPlayer[];
  activeId: number | null;
  onChoose: (player: ScoutedPlayer) => void;
  emptyHint?: string;
}) {
  return (
    <div>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onEnter();
            }
          }}
          placeholder="Type a name, then Enter"
          className="min-h-12 w-full rounded-xl border border-slate-200 px-3 py-3 text-base outline-none focus:ring-2 sm:text-sm"
        />
      </label>
      {value.trim() && hits.length === 0 ? (
        <p className="mt-2 text-xs text-slate-500">No one matches that spelling.</p>
      ) : null}
      {emptyHint && !value.trim() ? <p className="mt-2 text-xs text-slate-500">{emptyHint}</p> : null}
      <ul className="mt-2 max-h-56 space-y-1 overflow-y-auto">
        {hits.map((player) => (
          <li key={player.id}>
            <button
              type="button"
              onClick={() => onChoose(player)}
              className={`flex w-full min-h-11 items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm ${
                activeId === player.id ? "bg-slate-100" : "hover:bg-slate-50"
              }`}
            >
              <img src={player.photo} alt="" className="h-8 w-6 rounded object-cover bg-slate-100" />
              <span>
                <span className="font-medium text-slate-900">{player.webName}</span>
                <span className="text-slate-500"> · {player.clubShort}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PlayerCard({
  player,
  label,
  style,
  onClear,
}: {
  player: ScoutedPlayer;
  label: string;
  style?: { label: string; meaning: string };
  onClear?: () => void;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        {onClear ? (
          <button type="button" onClick={onClear} className="text-xs font-semibold text-slate-600 underline">
            Clear
          </button>
        ) : null}
      </div>
      <div className="mt-2 flex items-start gap-3">
        <img src={player.photo} alt="" className="h-16 w-12 rounded-xl object-cover bg-slate-100" />
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{player.webName}</h3>
          <p className="text-sm text-slate-600">
            {player.club} · {player.positionLabel}
          </p>
          <p className="mt-1 text-sm text-slate-700">{style?.label ?? "Too few minutes to cluster"}</p>
        </div>
      </div>
    </div>
  );
}

function StatCompare({ left, right }: { left: ScoutedPlayer; right: ScoutedPlayer }) {
  const rows = [
    { key: "goals", label: "Goals", a: left.goals, b: right.goals },
    { key: "assists", label: "Assists", a: left.assists, b: right.assists },
    { key: "xg", label: "xG", a: left.xg, b: right.xg },
    { key: "xa", label: "xA", a: left.xa, b: right.xa },
    { key: "minutes", label: "Minutes", a: left.minutes, b: right.minutes },
  ];
  const leftKit = kitForClub(left.club).primary;
  const rightBase = kitForClub(right.club);
  const rightKit = rightBase.primary === leftKit ? rightBase.secondary : rightBase.primary;
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 78;
  const leftShape = radarPolygon(rows, "a", cx, cy, radius);
  const rightShape = radarPolygon(rows, "b", cx, cy, radius);
  const rings = [0.33, 0.66, 1];

  return (
    <div className="mt-4 rounded-xl border border-slate-100 p-3 sm:p-4">
      <h3 className="text-sm font-semibold text-slate-900">Side by side</h3>
      <p className="mt-1 text-sm text-slate-600">
        Each spoke is scaled to the higher of these two players, not the whole league. Lab index stays
        a toy score. FPL price is a game price, not a fee.
      </p>
      <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: leftKit }} />
          {left.webName}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: rightKit }} />
          {right.webName}
        </span>
      </div>
      <div className="mt-4 grid items-center gap-4 lg:grid-cols-[240px_1fr]">
        <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto h-56 w-56" role="img" aria-label="Radar of goals, assists, xG, xA, and minutes">
          {rings.map((ring) => (
            <polygon
              key={ring}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1"
              points={rows
                .map((_, index) => {
                  const point = radarPoint(index, rows.length, ring, 1, cx, cy, radius);
                  return `${point.x},${point.y}`;
                })
                .join(" ")}
            />
          ))}
          <polygon points={leftShape} fill={leftKit} fillOpacity="0.28" stroke={leftKit} strokeWidth="2" />
          <polygon points={rightShape} fill={rightKit} fillOpacity="0.22" stroke={rightKit} strokeWidth="2" />
          {rows.map((row, index) => {
            const point = radarPoint(index, rows.length, 1, 1, cx, cy, radius + 16);
            return (
              <text
                key={row.key}
                x={point.x}
                y={point.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-500"
                fontSize="11"
              >
                {row.label}
              </text>
            );
          })}
        </svg>
        <div className="space-y-3">
          {rows.map((row) => {
            const widths = barWidths(row.a, row.b);
            return (
              <div key={row.key}>
                <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
                  <span className="font-medium text-slate-500">{row.label}</span>
                  <span className="tabular-nums text-slate-700">
                    {row.a} · {row.b}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <span
                      className="block h-full rounded-full"
                      style={{ width: `${widths.a}%`, background: leftKit }}
                    />
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <span
                      className="block h-full rounded-full"
                      style={{ width: `${widths.b}%`, background: rightKit }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          <p className="text-xs text-slate-500">
            Lab index {labIndex(left)} vs {labIndex(right)} · FPL {left.fplPrice} vs {right.fplPrice}
          </p>
        </div>
      </div>
    </div>
  );
}
