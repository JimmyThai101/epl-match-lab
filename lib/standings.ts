import type { FormResult, LabFixture, TableRow } from "@/lib/lab-types";
import type { FplFixture } from "@/lib/fpl";

export function mapFixtures(raw: FplFixture[]): LabFixture[] {
  return raw.map((fixture) => {
    const goals = fixture.stats?.find((stat) => stat.identifier === "goals_scored");
    return {
      id: fixture.id,
      event: fixture.event,
      kickoff: fixture.kickoff_time,
      homeId: fixture.team_h,
      awayId: fixture.team_a,
      homeScore: fixture.team_h_score,
      awayScore: fixture.team_a_score,
      finished: fixture.finished,
      started: fixture.started,
      minutes: fixture.minutes,
      homeDifficulty: fixture.team_h_difficulty,
      awayDifficulty: fixture.team_a_difficulty,
      homeScorers: (goals?.h ?? []).map((item) => ({
        playerId: item.element,
        goals: item.value,
      })),
      awayScorers: (goals?.a ?? []).map((item) => ({
        playerId: item.element,
        goals: item.value,
      })),
    };
  });
}

export function buildTable(teamIds: number[], fixtures: LabFixture[]): TableRow[] {
  const rows = new Map<number, Omit<TableRow, "position">>();

  for (const id of teamIds) {
    rows.set(id, {
      teamId: id,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      points: 0,
      form: [],
    });
  }

  const finished = fixtures
    .filter(
      (fixture) =>
        fixture.finished &&
        fixture.homeScore !== null &&
        fixture.awayScore !== null,
    )
    .sort((a, b) => (a.kickoff ?? "").localeCompare(b.kickoff ?? ""));

  for (const fixture of finished) {
    applyResult(rows.get(fixture.homeId), fixture.homeScore ?? 0, fixture.awayScore ?? 0);
    applyResult(rows.get(fixture.awayId), fixture.awayScore ?? 0, fixture.homeScore ?? 0);
  }

  return [...rows.values()]
    .map((row) => ({
      ...row,
      gd: row.gf - row.ga,
      form: row.form.slice(-5),
    }))
    .sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf)
    .map((row, index) => ({ ...row, position: index + 1 }));
}

function applyResult(
  row: Omit<TableRow, "position"> | undefined,
  scored: number,
  conceded: number,
) {
  if (!row) {
    return;
  }

  row.played += 1;
  row.gf += scored;
  row.ga += conceded;

  let result: FormResult = "D";
  if (scored > conceded) {
    row.won += 1;
    row.points += 3;
    result = "W";
  } else if (scored < conceded) {
    row.lost += 1;
    result = "L";
  } else {
    row.drawn += 1;
    row.points += 1;
  }

  row.form.push(result);
}

export function fixturesForTeam(fixtures: LabFixture[], teamId: number) {
  return fixtures.filter(
    (fixture) => fixture.homeId === teamId || fixture.awayId === teamId,
  );
}

export function headToHead(fixtures: LabFixture[], a: number, b: number) {
  return fixtures.filter(
    (fixture) =>
      (fixture.homeId === a && fixture.awayId === b) ||
      (fixture.homeId === b && fixture.awayId === a),
  );
}
