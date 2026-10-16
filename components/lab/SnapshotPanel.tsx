import { FaceOff, starPlayer } from "@/components/lab/FaceOff";
import { LabOutcomePeek } from "@/components/lab/LabOutcomePeek";
import { CompareBar, FormPills, Stat } from "@/components/lab/LabBits";
import { TermTip } from "@/components/lab/TermTip";
import { ordinal } from "@/lib/insights";
import type { ClubNotes, LabTeam } from "@/lib/lab-types";

function TeamStrip({
  team,
  notes,
  side,
}: {
  team: LabTeam;
  notes: ClubNotes | null;
  side: "home" | "away";
}) {
  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
      style={{ boxShadow: `inset 0 4px 0 ${team.primary}` }}
    >
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {side === "home" ? "Home · left" : "Away · right"}
      </p>
      <div className="flex items-center gap-3">
        <img src={team.badge} alt="" className="h-12 w-12 object-contain" />
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{team.name}</h2>
          <p className="text-sm text-slate-500">
            {team.position ? `${ordinal(team.position)} · ${team.points} pts` : "Table pending"}
            {team.manager ? ` · ${team.manager}` : ""}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1">
        <FormPills form={team.form} />
        <TermTip term="form" />
      </div>
      {notes?.stadium ? (
        <p className="mt-3 text-sm text-slate-600">
          Home ground: {notes.stadium}
          {notes.location ? ` · ${notes.location}` : ""}
        </p>
      ) : null}
    </section>
  );
}

export function SnapshotPanel({
  home,
  away,
  homeNotes,
  awayNotes,
  reading,
  xgNote,
  onOpenPlay,
}: {
  home: LabTeam;
  away: LabTeam;
  homeNotes: ClubNotes | null;
  awayNotes: ClubNotes | null;
  reading: string[];
  xgNote: string;
  onOpenPlay: () => void;
}) {
  const homeStar = starPlayer(home, "goals");
  const awayStar = starPlayer(away, "goals");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <TeamStrip team={home} notes={homeNotes} side="home" />
        <TeamStrip team={away} notes={awayNotes} side="away" />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-900">Who scores, who concedes</h2>
        <p className="mt-1 text-xs text-slate-500">Home left, away right. Kit colour is the bar, not the name.</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Stat
            label="Goals / game"
            value={String(home.goalsPerGame)}
            meaning={`${home.shortName} scoring rate`}
            accent={home.primary}
            term="goals-per-game"
          />
          <Stat
            label="Goals / game"
            value={String(away.goalsPerGame)}
            meaning={`${away.shortName} scoring rate`}
            accent={away.primary}
            term="goals-per-game"
          />
          <Stat
            label="Conceded / game"
            value={String(home.concededPerGame)}
            meaning={`${home.shortName} goals let in`}
            accent={home.primary}
            term="conceded"
          />
          <Stat
            label="Conceded / game"
            value={String(away.concededPerGame)}
            meaning={`${away.shortName} goals let in`}
            accent={away.primary}
            term="conceded"
          />
        </div>
        <div className="mt-4 space-y-3">
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
        </div>
      </section>

      <LabOutcomePeek home={home} away={away} />

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-900">What stands out</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
          {reading.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-900">Players to notice</h2>
        <p className="mt-1 text-sm text-slate-600">
          {homeStar ? `${homeStar.webName} (${home.shortName}) ${homeStar.goals} goals` : `${home.shortName} no scorer yet`}
          {" · "}
          {awayStar ? `${awayStar.webName} (${away.shortName}) ${awayStar.goals} goals` : `${away.shortName} no scorer yet`}
        </p>
        <div className="mt-4">
          <FaceOff home={home} away={away} />
        </div>
      </section>

      <button
        type="button"
        onClick={onOpenPlay}
        className="w-full rounded-2xl bg-slate-950 px-4 py-4 text-left text-white"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Sample, not a prediction
        </p>
        <p className="mt-1 text-lg font-semibold">Explore how results can vary</p>
        <p className="mt-1 text-sm leading-6 text-slate-300">
          Watch one fake 90 minutes, or roll hundreds of samples from these scoring rates.
        </p>
      </button>

      <p className="text-xs leading-5 text-slate-500">{xgNote}</p>
    </div>
  );
}
