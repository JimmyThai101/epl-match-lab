import { namesLikelyMatch } from "@/lib/club-name";

const BASE = "https://www.thesportsdb.com/api/v1/json/123";

type SportsDbTeam = {
  idTeam?: string;
  strTeam?: string;
  strStadium?: string;
  strLocation?: string;
  strBadge?: string;
};

type SportsDbPlayer = {
  strPlayer?: string;
  strWage?: string;
  strSigning?: string;
  dateSigned?: string;
  strPosition?: string;
};

async function readJson(url: string) {
  const response = await fetch(url, {
    headers: { "User-Agent": "EPLMatchLab/1.0 (educational)" },
    next: { revalidate: 86400 },
  });
  if (!response.ok) {
    return null;
  }
  try {
    return await response.json();
  } catch {
    return null;
  }
}

const SEARCH_NAME: Record<string, string> = {
  "Man City": "Manchester City",
  "Man Utd": "Manchester United",
  Spurs: "Tottenham",
  "Nott'm Forest": "Nottingham Forest",
  Brighton: "Brighton",
  "Coventry City": "Coventry City",
  "Hull City": "Hull City",
};

export async function fetchSportsDbClub(name: string) {
  const encoded = encodeURIComponent(SEARCH_NAME[name] ?? name);
  const json = await readJson(`${BASE}/searchteams.php?t=${encoded}`);
  const teams = (json?.teams ?? []) as SportsDbTeam[];
  const team =
    teams.find((item) => namesLikelyMatch(item.strTeam ?? "", name)) ?? teams[0];

  if (!team) {
    return null;
  }

  return {
    id: team.idTeam ?? "",
    stadium: team.strStadium ?? "",
    location: team.strLocation ?? "",
    badge: team.strBadge ?? "",
  };
}

export async function fetchSportsDbPlayers(teamId: string) {
  if (!teamId) {
    return [] as SportsDbPlayer[];
  }

  const json = await readJson(`${BASE}/lookup_all_players.php?id=${teamId}`);
  return (json?.player ?? []) as SportsDbPlayer[];
}

export type ContractNote = {
  name: string;
  wage: string;
  signing: string;
  signed: string;
  position: string;
};

export function toContractNotes(players: SportsDbPlayer[]): ContractNote[] {
  return players
    .map((player) => ({
      name: player.strPlayer ?? "",
      wage: player.strWage?.trim() ?? "",
      signing: player.strSigning?.trim() ?? "",
      signed: player.dateSigned?.trim() ?? "",
      position: player.strPosition ?? "",
    }))
    .filter(
      (player) =>
        player.name &&
        (player.wage || player.signing || player.signed) &&
        !/manager|coach/i.test(player.position),
    );
}
