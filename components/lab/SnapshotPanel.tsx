import { FaceOff, starPlayer } from "@/components/lab/FaceOff";
import { CompareBar, FormPills, Stat } from "@/components/lab/LabBits";
import { ordinal } from "@/lib/insights";
import type { ClubNotes, LabTeam } from "@/lib/lab-types";

function TeamColumn({ team, notes }: { team: LabTeam; notes: ClubNotes | null }) {
  const scorer = starPlayer(team, "goals");
  const creator = starPlayer(team, "assists");

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
      style={{ boxShadow: `inset 0 4px 0 ${team.primary}` }}
    >
      <div className="mb-4 flex items-center gap-3">
        <img src={team.badge} alt="" className="h-10 w-10 object-contain" />
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: team.primary }} />
            {team.name}
          </h2>
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
        <Stat
          label="Goals / game"
          value={String(team.goalsPerGame)}
          meaning="How often they score."
          accent={team.primary}
        />
        <Stat
          label="Goals conceded / game"
          value={String(team.concededPerGame)}
          meaning="How often they let a goal in."
          accent={team.primary}
        />
        <Stat
          label="Season goals"
          value={String(team.goals)}
          meaning={`${team.played} league games counted.`}
          accent={team.primary}
        />
        <Stat
          label="Expected goals"
          value={String(team.xg)}
          meaning="Quality of chances created (xG)."
          accent={team.primary}
        />
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
      <FaceOff home={home} away={away} />
      <div className="grid gap-4 lg:grid-cols-2">
        <TeamColumn team={home} notes={homeNotes} />
        <TeamColumn team={away} notes={awayNotes} />
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-900">Side-by-side</h2>
        <p className="mt-1 text-xs text-slate-500">
          Left bar is {home.name}, right bar is {away.name} — same colors as the photo frames.
        </p>
        <div className="mt-4 space-y-3">
          <CompareBar
            label="Points"
            left={home.points}
            right={away.points}
            leftName={home.shortName}
            rightName={away.shortName}
            leftColor={home.primary}
            rightColor={away.primary}
          />
          <CompareBar
            label="Goals / game"
            left={home.goalsPerGame}
            right={away.goalsPerGame}
            leftName={home.shortName}
            rightName={away.shortName}
            leftColor={home.primary}
            rightColor={away.primary}
          />
          <CompareBar
            label="Conceded / game"
            left={home.concededPerGame}
            right={away.concededPerGame}
            leftName={home.shortName}
            rightName={away.shortName}
            leftColor={home.primary}
            rightColor={away.primary}
          />
          <CompareBar
            label="xG"
            left={home.xg}
            right={away.xg}
            leftName={home.shortName}
            rightName={away.shortName}
            leftColor={home.primary}
            rightColor={away.primary}
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
