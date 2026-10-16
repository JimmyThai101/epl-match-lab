export const TERMS = {
  xg: {
    label: "xG",
    meaning:
      "Expected goals. How good the chances were, not only the ones that went in. Here it is the sum of current squad players' FPL xG, not a match-by-match club total.",
  },
  "goals-per-game": {
    label: "Goals / game",
    meaning: "League goals scored, divided by league matches played.",
  },
  conceded: {
    label: "Goals conceded / game",
    meaning: "League goals let in, divided by league matches played.",
  },
  form: {
    label: "Form",
    meaning: "Last finished league results. W win, D draw, L loss. Oldest to newest.",
  },
  "clean-sheet": {
    label: "Clean sheet",
    meaning: "A match where the team let in zero goals.",
  },
  gd: {
    label: "GD",
    meaning: "Goal difference: goals scored minus goals conceded.",
  },
} as const;

export type TermId = keyof typeof TERMS;
