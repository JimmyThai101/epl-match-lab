import type { LabTeam } from "@/lib/lab-types";

export type ScorerRow = {
  id: number;
  webName: string;
  position: string;
  goals: number;
  assists: number;
  xg: number;
  minutes: number;
  teamId: number;
  teamName: string;
  teamShort: string;
  badge: string;
};

export function seasonScorers(teams: LabTeam[], limit = 20): ScorerRow[] {
  return teams
    .flatMap((team) =>
      team.players
        .filter((player) => player.minutes > 0 || player.goals > 0 || player.assists > 0)
        .map((player) => ({
          id: player.id,
          webName: player.webName,
          position: player.position,
          goals: player.goals,
          assists: player.assists,
          xg: player.xg,
          minutes: player.minutes,
          teamId: team.id,
          teamName: team.name,
          teamShort: team.shortName,
          badge: team.badge,
        })),
    )
    .sort(
      (a, b) =>
        b.goals - a.goals ||
        b.assists - a.assists ||
        b.xg - a.xg ||
        a.webName.localeCompare(b.webName),
    )
    .slice(0, limit);
}
