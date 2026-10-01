import type { LabTeam, TableRow } from "@/lib/lab-types";

export function explainMatch(home: LabTeam, away: LabTeam) {
  const lines: string[] = [];

  if (home.position && away.position) {
    if (home.position === away.position) {
      lines.push(`They sit on the same rung of the table right now.`);
    } else {
      const higher = home.position < away.position ? home : away;
      const lower = higher.id === home.id ? away : home;
      const higherPos = higher.position ?? 0;
      const lowerPos = lower.position ?? 0;
      lines.push(
        `${higher.name} is higher in the table (${ordinal(higherPos)}, ${higher.points} pts) than ${lower.name} (${ordinal(lowerPos)}, ${lower.points} pts).`,
      );
    }
  }

  if (home.goalsPerGame === away.goalsPerGame) {
    lines.push(`Both sides have scored at the same rate so far (${home.goalsPerGame} goals per game).`);
  } else {
    const leader = home.goalsPerGame > away.goalsPerGame ? home : away;
    const trailer = leader.id === home.id ? away : home;
    lines.push(
      `${leader.name} has scored more often (${leader.goalsPerGame} goals per game vs ${trailer.goalsPerGame}).`,
    );
  }

  if (home.concededPerGame === away.concededPerGame) {
    lines.push(`Both have let in goals at the same rate (${home.concededPerGame} per game).`);
  } else {
    const tighter = home.concededPerGame < away.concededPerGame ? home : away;
    const leakier = tighter.id === home.id ? away : home;
    lines.push(
      `${tighter.name} has been harder to score against (${tighter.concededPerGame} conceded per game vs ${leakier.concededPerGame}).`,
    );
  }

  if (home.xg !== away.xg) {
    const leader = home.xg > away.xg ? home : away;
    lines.push(
      `${leader.name} has the higher expected goals total (xG ${leader.xg}). xG estimates how many goals the chances were worth, not just the ones that went in.`,
    );
  }

  const homeForm = home.form.join("");
  const awayForm = away.form.join("");
  if (homeForm || awayForm) {
    lines.push(
      `Recent league form (oldest to newest): ${home.name} ${homeForm || "—"} · ${away.name} ${awayForm || "—"}.`,
    );
  }

  if (home.played && away.played && home.played !== away.played) {
    lines.push(
      `Sample size is uneven: ${home.name} ${home.played} matches, ${away.name} ${away.played} matches.`,
    );
  } else if (home.played <= 6) {
    lines.push("This is still early in the season, so one hot streak can swing these numbers.");
  }

  lines.push("This is a reading of counting stats, not a match prediction.");
  return lines;
}

export function ordinal(value: number) {
  const rem10 = value % 10;
  const rem100 = value % 100;
  if (rem10 === 1 && rem100 !== 11) return `${value}st`;
  if (rem10 === 2 && rem100 !== 12) return `${value}nd`;
  if (rem10 === 3 && rem100 !== 13) return `${value}rd`;
  return `${value}th`;
}

export function tableForTeam(table: TableRow[], teamId: number) {
  return table.find((row) => row.teamId === teamId);
}
