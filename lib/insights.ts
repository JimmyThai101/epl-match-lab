import type { LabTeam, TableRow } from "@/lib/lab-types";

export function explainMatch(home: LabTeam, away: LabTeam) {
  const lines: string[] = [];
  const attackLeader = home.goalsPerGame === away.goalsPerGame ? null : home.goalsPerGame > away.goalsPerGame ? home : away;
  const tighter = home.concededPerGame === away.concededPerGame ? null : home.concededPerGame < away.concededPerGame ? home : away;

  if (attackLeader && tighter && attackLeader.id !== tighter.id) {
    lines.push(
      `${attackLeader.name} score more often (${attackLeader.goalsPerGame} per game), while ${tighter.name} concede fewer (${tighter.concededPerGame} per game).`,
    );
  } else if (attackLeader) {
    lines.push(
      `${attackLeader.name} have scored more often so far (${home.goalsPerGame} vs ${away.goalsPerGame} goals per game).`,
    );
  } else {
    lines.push(`Both sides have scored at the same rate so far (${home.goalsPerGame} goals per game).`);
  }

  const homeForm = home.form.join("");
  const awayForm = away.form.join("");
  if (homeForm || awayForm) {
    lines.push(
      `Recent league form (oldest to newest): ${home.name} ${homeForm || "—"} · ${away.name} ${awayForm || "—"}.`,
    );
  }

  if (home.position && away.position && home.position !== away.position) {
    const higher = home.position < away.position ? home : away;
    const lower = higher.id === home.id ? away : home;
    const higherPos = higher.position ?? 0;
    const lowerPos = lower.position ?? 0;
    lines.push(
      `${higher.name} sit ${ordinal(higherPos)} with ${higher.points} pts; ${lower.name} are ${ordinal(lowerPos)} with ${lower.points} pts.`,
    );
  } else if (home.played <= 6) {
    lines.push("This is still early in the season, so one hot streak can swing these numbers.");
  }

  return lines.slice(0, 3);
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
