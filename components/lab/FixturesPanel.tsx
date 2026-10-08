import type { LabFixture, LabTeam, LeagueSnapshot } from "@/lib/lab-types";
import { difficultyLabel, formatKickoff } from "@/lib/format";
import { fixturesForTeam, headToHead } from "@/lib/standings";

function scoreText(fixture: LabFixture) {
  if (fixture.homeScore === null || fixture.awayScore === null) {
    return "vs";
  }
  return `${fixture.homeScore}–${fixture.awayScore}`;
}

function FixtureRow({
  fixture,
  teams,
  playerNames,
}: {
  fixture: LabFixture;
  teams: Map<number, LabTeam>;
  playerNames: Record<number, string>;
}) {
  const home = teams.get(fixture.homeId);
  const away = teams.get(fixture.awayId);
  const live = fixture.started && !fixture.finished;
  const scorers = [
    ...fixture.homeScorers.map((item) => `${playerNames[item.playerId] ?? "Player"} ${item.goals}`),
    ...fixture.awayScorers.map((item) => `${playerNames[item.playerId] ?? "Player"} ${item.goals}`),
  ];

  return (
    <li className="rounded-xl border border-slate-100 px-3 py-3">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="flex min-w-0 items-center gap-2">
          <img src={home?.badge} alt="" className="h-5 w-5 object-contain" />
          <span className="truncate font-medium text-slate-900">
            {home?.shortName ?? fixture.homeId}
            <sup className="ml-0.5 text-[9px] font-bold tracking-wide text-slate-500" title="Home">
              H
            </sup>
          </span>
        </span>
        <span className="shrink-0 font-semibold text-slate-900">
          {live ? `${scoreText(fixture)} · ${fixture.minutes}'` : scoreText(fixture)}
        </span>
        <span className="flex min-w-0 items-center justify-end gap-2">
          <span className="truncate font-medium text-slate-900">{away?.shortName ?? fixture.awayId}</span>
          <img src={away?.badge} alt="" className="h-5 w-5 object-contain" />
        </span>
      </div>
      <p className="mt-1 text-[11px] text-slate-500">
        {live ? "Live from the FPL feed" : formatKickoff(fixture.kickoff)}
        {fixture.finished
          ? ""
          : ` · home rating ${fixture.homeDifficulty} (${difficultyLabel(fixture.homeDifficulty)})`}
      </p>
      {scorers.length > 0 ? (
        <p className="mt-1 text-[11px] text-slate-500">Goals: {scorers.join(", ")}</p>
      ) : null}
    </li>
  );
}

function TeamDiary({
  team,
  fixtures,
  teams,
  playerNames,
}: {
  team: LabTeam;
  fixtures: LabFixture[];
  teams: Map<number, LabTeam>;
  playerNames: Record<number, string>;
}) {
  const own = fixturesForTeam(fixtures, team.id);
  const recent = own.filter((fixture) => fixture.finished).slice(-5).reverse();
  const next = own.filter((fixture) => !fixture.finished).slice(0, 4);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <h3 className="text-base font-semibold text-slate-900">{team.name}</h3>
      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">Last results</p>
      <ul className="mt-2 space-y-2">
        {recent.length === 0 ? (
          <li className="text-sm text-slate-500">No finished matches yet.</li>
        ) : (
          recent.map((fixture) => (
            <FixtureRow
              key={fixture.id}
              fixture={fixture}
              teams={teams}
              playerNames={playerNames}
            />
          ))
        )}
      </ul>
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-500">Up next</p>
      <ul className="mt-2 space-y-2">
        {next.length === 0 ? (
          <li className="text-sm text-slate-500">No upcoming dates listed.</li>
        ) : (
          next.map((fixture) => (
            <FixtureRow
              key={fixture.id}
              fixture={fixture}
              teams={teams}
              playerNames={playerNames}
            />
          ))
        )}
      </ul>
    </section>
  );
}

export function FixturesPanel({
  data,
  home,
  away,
}: {
  data: LeagueSnapshot;
  home: LabTeam;
  away: LabTeam;
}) {
  const teams = new Map(data.teams.map((team) => [team.id, team]));
  const latestWeek = data.fixtures.filter((fixture) => fixture.event === data.currentEventId);
  const nextWeek = data.fixtures.filter((fixture) => fixture.event === data.nextEventId);
  const meetings = headToHead(data.fixtures, home.id, away.id);
  const live = data.fixtures.filter((fixture) => fixture.started && !fixture.finished);

  return (
    <div className="space-y-6">
      {live.length > 0 ? (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <h2 className="text-base font-semibold text-emerald-950">Happening now</h2>
          <ul className="mt-3 space-y-2">
            {live.map((fixture) => (
              <FixtureRow
                key={fixture.id}
                fixture={fixture}
                teams={teams}
                playerNames={data.playerNames}
              />
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <h2 className="text-base font-semibold text-slate-900">Latest gameweek</h2>
        <p className="mt-1 text-xs text-slate-500">{data.gameweek} across the whole league.</p>
        <ul className="mt-3 grid gap-2 md:grid-cols-2">
          {latestWeek.map((fixture) => (
            <FixtureRow
              key={fixture.id}
              fixture={fixture}
              teams={teams}
              playerNames={data.playerNames}
            />
          ))}
        </ul>
      </section>

      {nextWeek.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <h2 className="text-base font-semibold text-slate-900">Next gameweek</h2>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {nextWeek.map((fixture) => (
              <FixtureRow
                key={fixture.id}
                fixture={fixture}
                teams={teams}
                playerNames={data.playerNames}
              />
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <h2 className="text-base font-semibold text-slate-900">
          {home.name} vs {away.name} this season
        </h2>
        {meetings.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">They have not been listed against each other yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {meetings.map((fixture) => (
              <FixtureRow
                key={fixture.id}
                fixture={fixture}
                teams={teams}
                playerNames={data.playerNames}
              />
            ))}
          </ul>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <TeamDiary team={home} fixtures={data.fixtures} teams={teams} playerNames={data.playerNames} />
        <TeamDiary team={away} fixtures={data.fixtures} teams={teams} playerNames={data.playerNames} />
      </div>
    </div>
  );
}
