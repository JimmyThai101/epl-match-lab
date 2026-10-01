import type { ClubNotes, LabPlayer, LabTeam } from "@/lib/lab-types";
import { ordinal } from "@/lib/insights";
import { CompareBar, FormPills, Stat } from "@/components/lab/LabBits";

function starPlayer(team: LabTeam, key: "goals" | "assists" | "xg") {
  return [...team.players]
    .filter((player) => player.minutes > 0)
    .sort((a, b) => b[key] - a[key])[0] as LabPlayer | undefined;
}

function TeamColumn({ team, notes }: { team: LabTeam; notes: ClubNotes | null }) {
  const scorer = starPlayer(team, "goals");
  const creator = starPlayer(team, "assists");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-3">
        <img src={team.badge} alt="" className="h-10 w-10 object-contain" />
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{team.name}</h2>
          <p className="text-sm text-slate-500">
            Coach: {team.manager ?? "Not listed on Wikidata"}
          </p>
        </div>
      </div>
      <p className="mb-3 text-sm text-slate-600">
        {team.position ? `${ordinal(team.position)} · ${team.points} pts` : "Table pending"} ·{" "}
        {team.won}-{team.drawn}-{team.lost}
      </p>
      <div className="mb-4">
        <FormPills form={team.form} />
      </div>
      {notes?.stadium ? (
        <p className="mb-4 text-sm text-slate-600">
          Home ground: {notes.stadium}
          {notes.location ? ` · ${notes.location}` : ""}
        </p>
      ) : null}
      <div className="grid grid-cols-2 gap-2">
        <Stat label="Goals / game" value={String(team.goalsPerGame)} meaning="How often they score." />
        <Stat
          label="Goals conceded / game"
          value={String(team.concededPerGame)}
          meaning="How often they let a goal in."
        />
        <Stat
          label="Season goals"
          value={String(team.goals)}
          meaning={`${team.played} league games counted.`}
        />
        <Stat label="Expected goals" value={String(team.xg)} meaning="Quality of chances created (xG)." />
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">
        Standout so far: {scorer ? `${scorer.webName} ${scorer.goals} goals` : "no scorer yet"}
        {creator ? ` · ${creator.webName} ${creator.assists} assists` : ""}
        {team.yellowCards ? ` · ${team.yellowCards} yellow cards` : ""}
      </p>
    </section>
  );
}

export function SnapshotPanel({
  home,
  away,
  homeNotes,
  awayNotes,
  reading,
}: {
  home: LabTeam;
  away: LabTeam;
  homeNotes: ClubNotes | null;
  awayNotes: ClubNotes | null;
  reading: string[];
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <TeamColumn team={home} notes={homeNotes} />
        <TeamColumn team={away} notes={awayNotes} />
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-900">Side-by-side</h2>
        <div className="mt-4 space-y-3">
          <CompareBar
            label="Points"
            left={home.points}
            right={away.points}
            leftName={home.shortName}
            rightName={away.shortName}
          />
          <CompareBar
            label="Goals / game"
            left={home.goalsPerGame}
            right={away.goalsPerGame}
            leftName={home.shortName}
            rightName={away.shortName}
          />
          <CompareBar
            label="Conceded / game"
            left={home.concededPerGame}
            right={away.concededPerGame}
            leftName={home.shortName}
            rightName={away.shortName}
          />
          <CompareBar
            label="xG"
            left={home.xg}
            right={away.xg}
            leftName={home.shortName}
            rightName={away.shortName}
          />
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-900">Plain-English reading</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
          {reading.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
