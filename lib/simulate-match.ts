import type { LabPlayer, LabTeam } from "@/lib/lab-types";

export type SimKind = "chance" | "save" | "goal" | "yellow";

export type SimEvent = {
  minute: number;
  side: "home" | "away";
  kind: SimKind;
  x: number;
  y: number;
  line: string;
  player?: string;
};

export type SimulatedMatch = {
  seed: number;
  events: SimEvent[];
  finalHome: number;
  finalAway: number;
  chancesHome: number;
  chancesAway: number;
};

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickAttacker(team: LabTeam, random: () => number): LabPlayer | undefined {
  const pool = team.players.filter(
    (player) => player.minutes > 0 && player.position !== "GK",
  );
  if (pool.length === 0) {
    return undefined;
  }
  const weights = pool.map((player) => player.goals + player.assists * 0.8 + player.xg + 0.4);
  const total = weights.reduce((sum, value) => sum + value, 0);
  let roll = random() * total;
  for (let i = 0; i < pool.length; i += 1) {
    roll -= weights[i];
    if (roll <= 0) {
      return pool[i];
    }
  }
  return pool[0];
}

function chanceRate(attackGpg: number, defendCpg: number) {
  const expectedGoals = Math.max(0.4, (attackGpg + defendCpg) / 2);
  return expectedGoals / 90;
}

export function simulateMatch(home: LabTeam, away: LabTeam, seed = Date.now()): SimulatedMatch {
  const random = rng(seed);
  const events: SimEvent[] = [];
  let homeGoals = 0;
  let awayGoals = 0;
  let chancesHome = 0;
  let chancesAway = 0;

  const homeGoalP = chanceRate(home.goalsPerGame, away.concededPerGame);
  const awayGoalP = chanceRate(away.goalsPerGame, home.concededPerGame);
  const homeYellowP = home.played > 0 ? home.yellowCards / home.played / 90 : 0.01;
  const awayYellowP = away.played > 0 ? away.yellowCards / away.played / 90 : 0.01;

  for (let minute = 1; minute <= 90; minute += 1) {
    const y = 28 + random() * 44;

    if (random() < homeGoalP * 2.8) {
      chancesHome += 1;
      const player = pickAttacker(home, random);
      const isGoal = random() < homeGoalP / Math.max(homeGoalP * 2.8, 0.01);
      if (isGoal) {
        homeGoals += 1;
        events.push({
          minute,
          side: "home",
          kind: "goal",
          x: 92,
          y,
          player: player?.webName,
          line: `${minute}' — ${player?.webName ?? home.shortName} scores for ${home.name}.`,
        });
      } else if (random() < 0.45) {
        events.push({
          minute,
          side: "home",
          kind: "save",
          x: 84,
          y,
          player: player?.webName,
          line: `${minute}' — ${home.shortName} get a chance. ${away.shortName} keep it out.`,
        });
      } else {
        events.push({
          minute,
          side: "home",
          kind: "chance",
          x: 72,
          y,
          player: player?.webName,
          line: `${minute}' — ${home.name} work the ball forward. No shot on target.`,
        });
      }
    }

    if (random() < awayGoalP * 2.8) {
      chancesAway += 1;
      const player = pickAttacker(away, random);
      const isGoal = random() < awayGoalP / Math.max(awayGoalP * 2.8, 0.01);
      if (isGoal) {
        awayGoals += 1;
        events.push({
          minute,
          side: "away",
          kind: "goal",
          x: 8,
          y,
          player: player?.webName,
          line: `${minute}' — ${player?.webName ?? away.shortName} scores for ${away.name}.`,
        });
      } else if (random() < 0.45) {
        events.push({
          minute,
          side: "away",
          kind: "save",
          x: 16,
          y,
          player: player?.webName,
          line: `${minute}' — ${away.shortName} threaten. ${home.shortName} survive it.`,
        });
      } else {
        events.push({
          minute,
          side: "away",
          kind: "chance",
          x: 28,
          y,
          player: player?.webName,
          line: `${minute}' — ${away.name} push on. The move fizzles.`,
        });
      }
    }

    if (random() < homeYellowP) {
      events.push({
        minute,
        side: "home",
        kind: "yellow",
        x: 40 + random() * 20,
        y,
        line: `${minute}' — Yellow card, ${home.name}. A foul, not a goal.`,
      });
    }
    if (random() < awayYellowP) {
      events.push({
        minute,
        side: "away",
        kind: "yellow",
        x: 40 + random() * 20,
        y,
        line: `${minute}' — Yellow card, ${away.name}. The referee slows the game.`,
      });
    }
  }

  events.sort((a, b) => a.minute - b.minute || a.kind.localeCompare(b.kind));

  return {
    seed,
    events,
    finalHome: homeGoals,
    finalAway: awayGoals,
    chancesHome,
    chancesAway,
  };
}

export function simulateScoreline(home: LabTeam, away: LabTeam, seed: number) {
  const random = rng(seed);
  let homeGoals = 0;
  let awayGoals = 0;
  const homeGoalP = chanceRate(home.goalsPerGame, away.concededPerGame);
  const awayGoalP = chanceRate(away.goalsPerGame, home.concededPerGame);

  for (let minute = 1; minute <= 90; minute += 1) {
    if (random() < homeGoalP * 2.8) {
      if (random() < homeGoalP / Math.max(homeGoalP * 2.8, 0.01)) {
        homeGoals += 1;
      }
    }
    if (random() < awayGoalP * 2.8) {
      if (random() < awayGoalP / Math.max(awayGoalP * 2.8, 0.01)) {
        awayGoals += 1;
      }
    }
  }

  return { home: homeGoals, away: awayGoals };
}

export type SimSummary = {
  samples: number;
  homeWins: number;
  draws: number;
  awayWins: number;
  avgHome: number;
  avgAway: number;
  topScores: { score: string; count: number }[];
};

export function summarizeSimulations(
  home: LabTeam,
  away: LabTeam,
  samples = 500,
  baseSeed = 1,
): SimSummary {
  const scores = new Map<string, number>();
  let homeWins = 0;
  let draws = 0;
  let awayWins = 0;
  let homeGoals = 0;
  let awayGoals = 0;

  for (let i = 0; i < samples; i += 1) {
    const result = simulateScoreline(home, away, baseSeed + i);
    homeGoals += result.home;
    awayGoals += result.away;
    if (result.home > result.away) {
      homeWins += 1;
    } else if (result.home < result.away) {
      awayWins += 1;
    } else {
      draws += 1;
    }
    const key = `${result.home}–${result.away}`;
    scores.set(key, (scores.get(key) ?? 0) + 1);
  }

  return {
    samples,
    homeWins,
    draws,
    awayWins,
    avgHome: Number((homeGoals / samples).toFixed(2)),
    avgAway: Number((awayGoals / samples).toFixed(2)),
    topScores: [...scores.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 5)
      .map(([score, count]) => ({ score, count })),
  };
}
