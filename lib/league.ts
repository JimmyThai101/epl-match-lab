import { clubKey } from "@/lib/club-name";
import {
  fetchFplBootstrap,
  fetchFplFixtures,
  fplBadgeUrl,
  fplHeadshotUrl,
  type FplPlayer,
} from "@/lib/fpl";
import type { LabPlayer, LabTeam, LeagueSnapshot } from "@/lib/lab-types";
import { buildTable, mapFixtures } from "@/lib/standings";
import { kitForClub } from "@/lib/kit-colors";
import { fetchWikidataManagers } from "@/lib/wikidata";

const POSITIONS = ["GK", "DEF", "MID", "FWD"] as const;
const POSITION_LABELS = {
  GK: "Goalkeeper",
  DEF: "Defender",
  MID: "Midfielder",
  FWD: "Forward",
} as const;

function num(value: string | number | undefined) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function perGame(total: number, played: number) {
  if (played <= 0) {
    return 0;
  }
  return Number((total / played).toFixed(2));
}

function mapPlayer(player: FplPlayer): LabPlayer {
  const position = POSITIONS[player.element_type - 1] ?? "MID";
  return {
    id: player.id,
    name: `${player.first_name} ${player.second_name}`.trim(),
    webName: player.web_name,
    photo: fplHeadshotUrl(player.code),
    position,
    positionLabel: POSITION_LABELS[position],
    minutes: player.minutes,
    starts: player.starts,
    goals: player.goals_scored,
    assists: player.assists,
    xg: num(player.expected_goals),
    xa: num(player.expected_assists),
    cleanSheets: player.clean_sheets,
    goalsConceded: player.goals_conceded,
    yellowCards: player.yellow_cards ?? 0,
    redCards: player.red_cards ?? 0,
    pointsPerGame: player.points_per_game ?? "0.0",
    bonus: player.bonus ?? 0,
    form: player.form,
    status: player.status,
    news: player.news,
    chanceNext: player.chance_of_playing_next_round ?? null,
    fplPrice: `£${(player.now_cost / 10).toFixed(1)}m`,
    selectedBy: `${player.selected_by_percent}%`,
  };
}

function buildTeam(
  id: number,
  name: string,
  shortName: string,
  code: number,
  manager: string | null,
  squad: LabPlayer[],
): LabTeam {
  const used = squad.filter((player) => player.minutes > 0);
  const played = used.reduce((max, player) => Math.max(max, player.starts), 0);
  const goals = used.reduce((sum, player) => sum + player.goals, 0);
  const assists = used.reduce((sum, player) => sum + player.assists, 0);
  const xg = Number(used.reduce((sum, player) => sum + player.xg, 0).toFixed(2));
  const yellowCards = used.reduce((sum, player) => sum + player.yellowCards, 0);
  const redCards = used.reduce((sum, player) => sum + player.redCards, 0);
  const keepers = used
    .filter((player) => player.position === "GK")
    .sort((a, b) => b.minutes - a.minutes);
  const conceded = keepers[0]?.goalsConceded ?? 0;

  const kit = kitForClub(name);

  return {
    id,
    name,
    shortName,
    badge: fplBadgeUrl(code),
    manager,
    played,
    goals,
    conceded,
    goalsPerGame: perGame(goals, played),
    concededPerGame: perGame(conceded, played),
    xg,
    assists,
    yellowCards,
    redCards,
    position: null,
    points: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalDifference: 0,
    form: [],
    players: squad.sort((a, b) => b.minutes - a.minutes),
    primary: kit.primary,
    secondary: kit.secondary,
  };
}

export async function getLeagueSnapshot(): Promise<LeagueSnapshot> {
  const [fpl, managers, rawFixtures] = await Promise.all([
    fetchFplBootstrap(),
    fetchWikidataManagers(),
    fetchFplFixtures(),
  ]);

  const byTeam = new Map<number, LabPlayer[]>();
  const playerNames: Record<number, string> = {};
  for (const player of fpl.elements) {
    const mapped = mapPlayer(player);
    playerNames[mapped.id] = mapped.webName;
    const list = byTeam.get(player.team) ?? [];
    list.push(mapped);
    byTeam.set(player.team, list);
  }

  const fixtures = mapFixtures(rawFixtures);
  const table = buildTable(
    fpl.teams.map((team) => team.id),
    fixtures,
  );
  const tableById = new Map(table.map((row) => [row.teamId, row]));

  const teams = fpl.teams
    .map((team) => {
      const built = buildTeam(
        team.id,
        team.name,
        team.short_name,
        team.code,
        managers.get(clubKey(team.name)) ?? null,
        byTeam.get(team.id) ?? [],
      );
      const row = tableById.get(team.id);
      if (row) {
        built.position = row.position;
        built.points = row.points;
        built.won = row.won;
        built.drawn = row.drawn;
        built.lost = row.lost;
        built.goalDifference = row.gd;
        built.form = row.form;
        built.played = row.played;
        built.goals = row.gf;
        built.conceded = row.ga;
        built.goalsPerGame = perGame(row.gf, row.played);
        built.concededPerGame = perGame(row.ga, row.played);
      }
      return built;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const current = fpl.events.find((event) => event.is_current);
  const next = fpl.events.find((event) => event.is_next);
  const finishedMatches = fixtures.filter((fixture) => fixture.finished).length;

  return {
    updatedLabel: "Squads refresh about every 30 minutes. Fixtures refresh about every 5 minutes.",
    gameweek: current?.name ?? next?.name ?? "Current season",
    currentEventId: current?.id ?? null,
    nextEventId: next?.id ?? null,
    finishedMatches,
    totalMatches: fixtures.length || 380,
    sourceNote:
      "League table and scores come from the public Fantasy Premier League fixture list. Player stats, coaches, and wages still come from FPL, Wikidata, and TheSportsDB. Missing values stay blank. This is not an official Premier League product.",
    teams,
    table,
    fixtures,
    playerNames,
  };
}
