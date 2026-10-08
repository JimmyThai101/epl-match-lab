export type WatchKind = "injury" | "suspended" | "transfer" | "form";

export type WatchTag = {
  kind: WatchKind;
  label: string;
  className: string;
};

function newsText(player: { news: string; status: string }) {
  return `${player.news} ${player.status}`.toLowerCase();
}

export function watchTag(
  player: {
    news: string;
    status: string;
    goals: number;
    assists: number;
    minutes: number;
    form: string;
  },
  standout = false,
): WatchTag | null {
  const news = newsText(player);

  if (
    player.status === "i" ||
    player.status === "d" ||
    /injur|hamstring|groin|knock|fitness|illness|ankle|thigh|knee|muscle/.test(news)
  ) {
    return {
      kind: "injury",
      label: "Injury",
      className: "bg-rose-100 text-rose-800",
    };
  }

  if (player.status === "s" || /suspen|ban|red card/.test(news)) {
    return {
      kind: "suspended",
      label: "Suspended",
      className: "bg-orange-100 text-orange-900",
    };
  }

  if (/transfer|loan|left the club|joined|depart|sold|released/.test(news)) {
    return {
      kind: "transfer",
      label: "Transfer talk",
      className: "bg-violet-100 text-violet-900",
    };
  }

  if (standout && player.minutes > 0 && player.status === "a") {
    return {
      kind: "form",
      label: "In form",
      className: "bg-emerald-100 text-emerald-800",
    };
  }

  return null;
}

export function isStandout(
  player: { id: number; goals: number; assists: number; minutes: number },
  squad: { id: number; goals: number; assists: number; minutes: number }[],
) {
  const ranked = [...squad]
    .filter((item) => item.minutes > 0)
    .sort((a, b) => b.goals + b.assists - (a.goals + a.assists));
  return ranked.slice(0, 3).some((item) => item.id === player.id && player.goals + player.assists > 0);
}
