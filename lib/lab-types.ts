export type Position = "GK" | "DEF" | "MID" | "FWD";

export type FormResult = "W" | "D" | "L";

export type LabPlayer = {
  id: number;
  name: string;
  webName: string;
  photo: string;
  position: Position;
  positionLabel: string;
  minutes: number;
  starts: number;
  goals: number;
  assists: number;
  xg: number;
  xa: number;
  cleanSheets: number;
  goalsConceded: number;
  yellowCards: number;
  redCards: number;
  pointsPerGame: string;
  bonus: number;
  form: string;
  status: string;
  news: string;
  chanceNext: number | null;
  fplPrice: string;
  selectedBy: string;
};

export type LabTeam = {
  id: number;
  name: string;
  shortName: string;
  badge: string;
  manager: string | null;
  played: number;
  goals: number;
  conceded: number;
  goalsPerGame: number;
  concededPerGame: number;
  xg: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  position: number | null;
  points: number;
  won: number;
  drawn: number;
  lost: number;
  goalDifference: number;
  form: FormResult[];
  players: LabPlayer[];
  primary: string;
  secondary: string;
};

export type LabFixture = {
  id: number;
  event: number | null;
  kickoff: string | null;
  homeId: number;
  awayId: number;
  homeScore: number | null;
  awayScore: number | null;
  finished: boolean;
  started: boolean;
  minutes: number;
  homeDifficulty: number;
  awayDifficulty: number;
  homeScorers: { playerId: number; goals: number }[];
  awayScorers: { playerId: number; goals: number }[];
};

export type TableRow = {
  teamId: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  form: FormResult[];
  position: number;
};

export type LeagueSnapshot = {
  updatedLabel: string;
  gameweek: string;
  currentEventId: number | null;
  nextEventId: number | null;
  finishedMatches: number;
  totalMatches: number;
  sourceNote: string;
  teams: LabTeam[];
  table: TableRow[];
  fixtures: LabFixture[];
  playerNames: Record<number, string>;
};

export type ClubNotes = {
  stadium: string | null;
  location: string | null;
  contracts: {
    name: string;
    wage: string;
    signing: string;
    signed: string;
    position: string;
  }[];
  note: string;
};
