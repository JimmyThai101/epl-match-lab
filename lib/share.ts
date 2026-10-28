import { kitForClub } from "@/lib/kit-colors";
import { resolveMatchup } from "@/lib/matchup-selection";

export type ShareSearch = {
  a?: string | string[];
  b?: string | string[];
  tab?: string | string[];
  player?: string | string[];
  pid?: string | string[];
  vs?: string | string[];
};

export type ShareClub = { id: number; name: string; shortName: string };

export type SharePlayer = { id: number; webName: string };

export type ShareCard = {
  title: string;
  description: string;
  eyebrow: string;
  headline: string;
  kicker: string;
  home: ShareClub | null;
  away: ShareClub | null;
  playerA: string | null;
  playerB: string | null;
  homeKit: string;
  awayKit: string;
};

const TAB_EYEBROW: Record<string, string> = {
  overview: "Snapshot",
  play: "Sample match",
  guide: "Words",
  table: "Table",
  fixtures: "Fixtures",
  squad: "Players",
  scout: "Scout",
  contracts: "Money",
};

export function firstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0]?.trim() || undefined;
  }
  const trimmed = value?.trim();
  return trimmed || undefined;
}

export function parseIdParam(value: string | string[] | undefined) {
  const raw = firstParam(value);
  if (!raw) {
    return null;
  }
  const id = Number.parseInt(raw, 10);
  return Number.isFinite(id) ? id : null;
}

export function tabEyebrow(tab: string | undefined) {
  return TAB_EYEBROW[tab ?? "overview"] ?? "Lab";
}

export function shareCopy(input: {
  homeName: string;
  awayName: string;
  tab?: string;
  playerA?: string | null;
  playerB?: string | null;
}) {
  const tab = input.tab ?? "overview";
  if (tab === "scout" && input.playerA) {
    const vs = input.playerB ? ` vs ${input.playerB}` : "";
    return {
      title: `Scout: ${input.playerA}${vs} · EPL Match Lab`,
      description:
        "Similar players from public FPL stats. Lab index is not a transfer fee. Missing wages stay blank.",
    };
  }
  if (tab === "play") {
    return {
      title: `${input.homeName} vs ${input.awayName} · sample match · EPL Match Lab`,
      description:
        "One sample 90 minutes from season scoring rates. Lab model, not a prediction or a tip.",
    };
  }
  return {
    title: `${input.homeName} vs ${input.awayName} · EPL Match Lab`,
    description:
      "Compare scoring and conceding in plain English. Public FPL data. Missing wages stay blank. Not a forecast.",
  };
}

export function buildShareCard(input: {
  teams: ShareClub[];
  players: SharePlayer[];
  search: ShareSearch;
}): ShareCard {
  const tab = firstParam(input.search.tab) ?? "overview";
  const requested = resolveMatchup(
    input.teams.map((team) => ({ id: team.id, name: team.name })),
    { home: parseIdParam(input.search.a), away: parseIdParam(input.search.b) },
  );
  const home = input.teams.find((team) => team.id === requested.homeId) ?? null;
  const away = input.teams.find((team) => team.id === requested.awayId) ?? null;
  const byId = new Map(input.players.map((player) => [player.id, player]));

  const fromPid = byId.get(parseIdParam(input.search.pid) ?? -1)?.webName;
  const fromName = firstParam(input.search.player);
  const playerA = fromPid ?? fromName ?? null;
  const playerB = byId.get(parseIdParam(input.search.vs) ?? -1)?.webName ?? null;

  const homeName = home?.name ?? "Home";
  const awayName = away?.name ?? "Away";
  const copy = shareCopy({ homeName, awayName, tab, playerA, playerB });
  const scout = tab === "scout" && playerA;

  return {
    title: copy.title,
    description: copy.description,
    eyebrow: `EPL Match Lab · ${tabEyebrow(tab)}`,
    headline: scout
      ? playerB
        ? `${playerA} vs ${playerB}`
        : playerA
      : `${homeName} vs ${awayName}`,
    kicker: scout
      ? `${homeName} vs ${awayName} · public FPL stats, not fees`
      : "Public data · sample match is not a prediction",
    home,
    away,
    playerA,
    playerB,
    homeKit: kitForClub(homeName).primary,
    awayKit: kitForClub(awayName).primary,
  };
}

export const DEFAULT_SHARE: ShareCard = {
  title: "EPL Match Lab",
  description:
    "I watch the Premier League, so I built a public-data lab: compare any two clubs in plain English, a sample match that is not a prediction, and a scout view of similar players. Missing salaries stay blank.",
  eyebrow: "EPL Match Lab",
  headline: "Pick two clubs. Understand the matchup.",
  kicker: "Public FPL, Wikidata, TheSportsDB · missing wages stay blank",
  home: null,
  away: null,
  playerA: null,
  playerB: null,
  homeKit: "#EF0107",
  awayKit: "#6CABDD",
};

export function ogImagePath(search: ShareSearch) {
  const params = new URLSearchParams();
  const keys = ["a", "b", "tab", "player", "pid", "vs"] as const;
  for (const key of keys) {
    const value = firstParam(search[key]);
    if (value) {
      params.set(key, value);
    }
  }
  const query = params.toString();
  return query ? `/api/og?${query}` : "/api/og";
}
