import type { LabPlayer, LabTeam, Position } from "@/lib/lab-types";

export type ScoutedPlayer = LabPlayer & {
  club: string;
  clubShort: string;
  clubId: number;
};

export function allScoutedPlayers(teams: LabTeam[]): ScoutedPlayer[] {
  return teams.flatMap((team) =>
    team.players
      .filter((player) => player.minutes > 0)
      .map((player) => ({
        ...player,
        club: team.name,
        clubShort: team.shortName,
        clubId: team.id,
      })),
  );
}

export function featureVector(player: LabPlayer) {
  const nineties = Math.max(player.minutes / 90, 0.25);
  return [
    player.goals / nineties,
    player.assists / nineties,
    player.xg / nineties,
    player.xa / nineties,
    player.cleanSheets / nineties,
    player.yellowCards / nineties,
    player.starts / Math.max(nineties, 1),
  ];
}

function distance(a: number[], b: number[]) {
  return Math.sqrt(a.reduce((sum, value, index) => sum + (value - b[index]) ** 2, 0));
}

export function similarPlayers(target: ScoutedPlayer, pool: ScoutedPlayer[], limit = 8) {
  const targetVec = featureVector(target);
  return pool
    .filter((player) => player.id !== target.id)
    .map((player) => ({
      player,
      distance: distance(targetVec, featureVector(player)),
      samePosition: player.position === target.position,
    }))
    .sort((a, b) => {
      if (a.samePosition !== b.samePosition) {
        return a.samePosition ? -1 : 1;
      }
      return a.distance - b.distance;
    })
    .slice(0, limit);
}

export type StyleGroup = {
  id: number;
  label: string;
  meaning: string;
};

function styleFromCentroid(center: number[], members: ScoutedPlayer[]): StyleGroup {
  const goals = center[0];
  const assists = center[1];
  const sheets = center[4];
  const gkShare = members.filter((player) => player.position === "GK").length / Math.max(members.length, 1);
  if (gkShare > 0.5) {
    return { id: 0, label: "Keepers", meaning: "Mostly goalkeepers in this bunch." };
  }
  if (sheets > goals && sheets > assists) {
    return { id: 0, label: "Stoppers", meaning: "Clean sheets show up more than goals or assists." };
  }
  if (assists > goals) {
    return { id: 0, label: "Creators", meaning: "Assists and chance-making lead this group." };
  }
  if (goals > assists) {
    return { id: 0, label: "Finishers", meaning: "Goals per 90 lead this group." };
  }
  return { id: 0, label: "All-round", meaning: "No one stat dominates." };
}

export function clusterPlayers(pool: ScoutedPlayer[], k = 4): Map<number, StyleGroup> {
  const usable = pool.filter((player) => player.minutes >= 90);
  const grouped = new Map<number, StyleGroup>();
  if (usable.length < k) {
    return grouped;
  }

  const points = usable.map((player) => featureVector(player));
  let centers = points.filter((_, index) => index % Math.floor(usable.length / k) === 0).slice(0, k);
  while (centers.length < k) {
    centers.push(points[centers.length]);
  }

  let assignment = usable.map(() => 0);
  for (let step = 0; step < 12; step += 1) {
    assignment = points.map((point) => {
      let best = 0;
      let bestDist = Infinity;
      centers.forEach((center, index) => {
        const dist = distance(point, center);
        if (dist < bestDist) {
          bestDist = dist;
          best = index;
        }
      });
      return best;
    });
    centers = centers.map((_, index) => {
      const members = points.filter((_, i) => assignment[i] === index);
      if (members.length === 0) {
        return centers[index];
      }
      return members[0].map((_, dim) => members.reduce((sum, row) => sum + row[dim], 0) / members.length);
    });
  }

  for (let index = 0; index < k; index += 1) {
    const members = usable.filter((_, i) => assignment[i] === index);
    const style = styleFromCentroid(centers[index], members);
    style.id = index;
    for (const player of members) {
      grouped.set(player.id, style);
    }
  }
  return grouped;
}

export function labIndex(player: LabPlayer) {
  const nineties = Math.max(player.minutes / 90, 0.25);
  const value =
    (player.goals * 4 + player.assists * 3 + player.xg * 1.5 + player.xa * 1.2) / nineties +
    player.cleanSheets * 0.4;
  return Number(value.toFixed(2));
}

export function searchPlayers(pool: ScoutedPlayer[], query: string, position: Position | "ALL") {
  const needle = query.trim().toLowerCase();
  return pool.filter((player) => {
    if (position !== "ALL" && player.position !== position) {
      return false;
    }
    if (!needle) {
      return player.minutes >= 180;
    }
    return `${player.webName} ${player.name} ${player.club}`.toLowerCase().includes(needle);
  });
}
