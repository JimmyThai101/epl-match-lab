export type Availability = "out" | "doubtful" | "available";

export type NewsPlayer = {
  id: number;
  webName: string;
  position: string;
  status: string;
  news: string;
  chanceNext: number | null;
};

const POSITION_ORDER: Record<string, number> = { GK: 0, DEF: 1, MID: 2, FWD: 3 };

export function availability(player: Pick<NewsPlayer, "status" | "chanceNext">): Availability {
  const status = player.status.toLowerCase();
  if (status === "i" || status === "s" || status === "u" || status === "n" || player.chanceNext === 0) {
    return "out";
  }
  if (status === "d" || (player.chanceNext !== null && player.chanceNext > 0 && player.chanceNext < 100)) {
    return "doubtful";
  }
  return "available";
}

export function groupTeamNews(players: NewsPlayer[]) {
  const groups: Record<Availability, NewsPlayer[]> = {
    out: [],
    doubtful: [],
    available: [],
  };
  for (const player of players) {
    groups[availability(player)].push(player);
  }
  const byName = (a: NewsPlayer, b: NewsPlayer) => a.webName.localeCompare(b.webName);
  groups.out.sort((a, b) => (a.chanceNext ?? -1) - (b.chanceNext ?? -1) || byName(a, b));
  groups.doubtful.sort(byName);
  groups.available.sort(
    (a, b) => (POSITION_ORDER[a.position] ?? 9) - (POSITION_ORDER[b.position] ?? 9) || byName(a, b),
  );
  return groups;
}
