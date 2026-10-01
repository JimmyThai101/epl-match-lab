const FPL_URL = "https://fantasy.premierleague.com/api/bootstrap-static/";

export type FplTeam = {
  id: number;
  name: string;
  short_name: string;
  code: number;
};

export type FplPlayer = {
  id: number;
  code: number;
  first_name: string;
  second_name: string;
  web_name: string;
  team: number;
  element_type: number;
  minutes: number;
  starts: number;
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  goals_conceded: number;
  expected_goals: string;
  expected_assists: string;
  form: string;
  status: string;
  news: string;
  now_cost: number;
  selected_by_percent: string;
  yellow_cards?: number;
  red_cards?: number;
  bonus?: number;
  points_per_game?: string;
  chance_of_playing_next_round?: number | null;
};

export type FplFixture = {
  id: number;
  event: number | null;
  kickoff_time: string | null;
  team_h: number;
  team_a: number;
  team_h_score: number | null;
  team_a_score: number | null;
  finished: boolean;
  started: boolean;
  minutes: number;
  team_h_difficulty: number;
  team_a_difficulty: number;
  stats?: { identifier: string; h: { value: number; element: number }[]; a: { value: number; element: number }[] }[];
};

export type FplEvent = {
  id: number;
  name: string;
  is_current: boolean;
  is_next: boolean;
  deadline_time: string;
};

export type FplBootstrap = {
  teams: FplTeam[];
  elements: FplPlayer[];
  events: FplEvent[];
};

export async function fetchFplBootstrap() {
  const response = await fetch(FPL_URL, {
    headers: { "User-Agent": "EPLMatchLab/1.0 (educational)" },
    next: { revalidate: 1800 },
  });

  if (!response.ok) {
    throw new Error(`Fantasy Premier League data is unavailable (${response.status}).`);
  }

  return (await response.json()) as FplBootstrap;
}

export async function fetchFplFixtures() {
  const response = await fetch("https://fantasy.premierleague.com/api/fixtures/", {
    headers: { "User-Agent": "EPLMatchLab/1.0 (educational)" },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    return [] as FplFixture[];
  }

  return (await response.json()) as FplFixture[];
}

export function fplBadgeUrl(teamCode: number) {
  return `https://resources.premierleague.com/premierleague/badges/70/t${teamCode}.png`;
}

export function fplHeadshotUrl(playerCode: number) {
  return `https://resources.premierleague.com/premierleague/photos/players/110x140/p${playerCode}.png`;
}
