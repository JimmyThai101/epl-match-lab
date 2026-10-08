import { FaceOff, starPlayer } from "@/components/lab/FaceOff";
import { CompareBar, FormPills, Stat } from "@/components/lab/LabBits";
import { WordTips } from "@/components/lab/WordTips";
import { ordinal } from "@/lib/insights";
import type { ClubNotes, LabTeam } from "@/lib/lab-types";

function TeamColumn({
  team,
  notes,
  side,
}: {
  team: LabTeam;
  notes: ClubNotes | null;
  side: "home" | "away";
}) {
  const scorer = starPlayer(team, "goals");
  const creator = starPlayer(team, "assists");

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
      style={{ boxShadow: `inset 0 4px 0 ${team.primary}` }}
    >
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {side === "home" ? "Home · left" : "Away · right"}
      </p>
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
  onOpenWords,
  onOpenPlay,
}: {
  home: LabTeam;
  away: LabTeam;
  homeNotes: ClubNotes | null;
  awayNotes: ClubNotes | null;
  reading: string[];
  onOpenWords: () => void;
  onOpenPlay: () => void;
}) {
  return (
    <div className="space-y-6">
      <WordTips onOpenWords={onOpenWords} />
      <button
        type="button"
        onClick={onOpenPlay}
        className="w-full rounded-2xl bg-slate-950 px-4 py-4 text-left text-white"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Lab 2.0
        </p>
        <p className="mt-1 text-lg font-semibold">Play a sample match</p>
        <p className="mt-1 text-sm leading-6 text-slate-300">
          A tiny soccer story on a pitch, timed to 90 minutes, using these two clubs&apos; real scoring
          rates. It is a demo, not tonight&apos;s result.
        </p>
      </button>
      <FaceOff home={home} away={away} />
      <div className="grid gap-4 lg:grid-cols-2">
        <TeamColumn team={home} notes={homeNotes} side="home" />
        <TeamColumn team={away} notes={awayNotes} side="away" />
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-900">Side-by-side</h2>
        <p className="mt-1 text-xs text-slate-500">
          Home is always left, away is always right. Kit colour is the bar and the dot — names stay dark so they stay readable.
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
