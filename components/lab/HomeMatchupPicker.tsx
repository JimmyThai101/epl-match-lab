"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FormPills, TeamPicker } from "@/components/lab/LabBits";
import { explainMatch } from "@/lib/insights";
import type { LabTeam, LeagueSnapshot } from "@/lib/lab-types";
import { resolveMatchup } from "@/lib/matchup-selection";
import { readJson } from "@/lib/storage";

type Pin = { a?: number; b?: number; season?: string };

export function HomeMatchupPicker() {
  const router = useRouter();
  const [data, setData] = useState<LeagueSnapshot | null>(null);
  const [error, setError] = useState("");
  const [homeId, setHomeId] = useState<number | null>(null);
  const [awayId, setAwayId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/league", { cache: "no-store" })
      .then(async (response) => {
        const json = await response.json();
        if (!response.ok) {
          throw new Error(json.error || "Could not load clubs.");
        }
        return json as LeagueSnapshot;
      })
      .then((snapshot) => {
        setData(snapshot);
        const pin = readJson<Pin>("epl-match-lab-pin");
        const pinned =
          pin?.season === snapshot.seasonKey
            ? { home: pin.a, away: pin.b }
            : {};
        const resolved = resolveMatchup(snapshot.teams, pinned);
        setHomeId(resolved.homeId);
        setAwayId(resolved.awayId);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  const home = data?.teams.find((team) => team.id === homeId) ?? null;
  const away = data?.teams.find((team) => team.id === awayId) ?? null;
  const preview = useMemo(() => (home && away ? explainMatch(home, away)[0] : ""), [away, home]);

  function go(tab: "overview" | "play" | "guide") {
    if (!homeId || !awayId) {
      return;
    }
    router.push(`/lab?a=${homeId}&b=${awayId}&tab=${tab}`);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    go("overview");
  }

  if (error) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        {error} Open the lab anyway after the feed is back.
      </p>
    );
  }

  if (!data || !home || !away) {
    return <p className="text-sm text-slate-500">Loading clubs…</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <TeamPicker
          label="Home (left)"
          teams={data.teams}
          value={home.id}
          blocked={away.id}
          onChange={(id) => {
            if (id === awayId) {
              setAwayId(home.id);
            }
            setHomeId(id);
          }}
          accent={home.primary}
        />
        <TeamPicker
          label="Away (right)"
          teams={data.teams}
          value={away.id}
          blocked={home.id}
          onChange={(id) => {
            if (id === homeId) {
              setHomeId(away.id);
            }
            setAwayId(id);
          }}
          accent={away.primary}
        />
      </div>
      <Preview home={home} away={away} line={preview} />
      <p className="text-sm text-slate-600">
        If those words are new, tap <span className="font-semibold text-amber-900">Words first</span>. Compare clubs is ready whenever you are.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={() => go("guide")}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-amber-900 px-6 py-3 text-base font-semibold text-white hover:bg-amber-800 sm:w-fit"
        >
          Words first
        </button>
        <button
          type="submit"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-base font-semibold text-white hover:bg-slate-800 sm:w-fit"
        >
          Compare clubs
        </button>
        <button
          type="button"
          onClick={() => go("play")}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 sm:w-fit"
        >
          Explore a sample match
        </button>
      </div>
    </form>
  );
}

function Preview({ home, away, line }: { home: LabTeam; away: LabTeam; line: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Example of what you’ll see</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <ClubPeek team={home} side="Home" />
        <ClubPeek team={away} side="Away" />
      </div>
      {line ? <p className="mt-3 text-sm leading-6 text-slate-600">{line}</p> : null}
    </div>
  );
}

function ClubPeek({ team, side }: { team: LabTeam; side: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{side}</p>
      <p className="font-semibold text-slate-900">{team.name}</p>
      <p className="text-sm text-slate-600">
        {team.goalsPerGame} scored / game · {team.concededPerGame} conceded / game
      </p>
      <div className="mt-2">
        <FormPills form={team.form} />
      </div>
    </div>
  );
}
