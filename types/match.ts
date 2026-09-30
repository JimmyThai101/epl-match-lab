export type FormResult = "W" | "D" | "L";

export type StatFormat = "number" | "percent";

export type ComparisonStat = {
  id: string;
  label: string;
  home: number;
  away: number;
  format: StatFormat;
  higherIsBetter: boolean;
};

export type SplitStats = {
  label: string;
  goalsPerGame: number;
  xG: number;
  shotsPerGame: number;
  possession: number;
  winPercentage: number;
};

export type TeamProfile = {
  id: string;
  name: string;
  shortName: string;
  side: "home" | "away";
  accent: string;
  form: FormResult[];
  goalsScoredLast5: number;
  goalsConcededLast5: number;
  split: SplitStats;
};

export type Prediction = {
  label: "Arsenal Win" | "Draw" | "Liverpool Win";
  homeGoals: number;
  awayGoals: number;
  homeWinPct: number;
  drawPct: number;
  awayWinPct: number;
  explanation: string;
};

export type HistoryRow = {
  match: string;
  prediction: string;
  actual: string;
  correct: boolean;
};

export type MatchDashboard = {
  competition: string;
  kickoffLabel: string;
  venue: string;
  dataNote: string;
  home: TeamProfile;
  away: TeamProfile;
  comparisons: ComparisonStat[];
  observations: string[];
  prediction: Prediction;
  modelFactors: string[];
  history: HistoryRow[];
};
