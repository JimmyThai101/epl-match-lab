"""Toy W/D/L model on finished FPL fixtures. Not a tip.

Uses the same public FPL feed as the website. Does not spend football-data.org quota.
"""

from __future__ import annotations

from collections import defaultdict, deque

import pandas as pd
import requests
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

FPL_FIXTURES = "https://fantasy.premierleague.com/api/fixtures/"
FPL_BOOTSTRAP = "https://fantasy.premierleague.com/api/bootstrap-static/"
FORM_WINDOW = 5


def load_finished() -> pd.DataFrame:
    fixtures = requests.get(FPL_FIXTURES, timeout=30).json()
    bootstrap = requests.get(FPL_BOOTSTRAP, timeout=30).json()
    names = {team["id"]: team["short_name"] for team in bootstrap["teams"]}
    rows = []
    for fixture in fixtures:
        if not fixture.get("finished"):
            continue
        if fixture.get("event") is None:
            continue
        if fixture.get("team_h_score") is None or fixture.get("team_a_score") is None:
            continue
        home_goals = int(fixture["team_h_score"])
        away_goals = int(fixture["team_a_score"])
        if home_goals > away_goals:
            result = "H"
        elif home_goals < away_goals:
            result = "A"
        else:
            result = "D"
        rows.append(
            {
                "gameweek": int(fixture["event"]),
                "kickoff": fixture.get("kickoff_time") or "",
                "home_id": int(fixture["team_h"]),
                "away_id": int(fixture["team_a"]),
                "home": names.get(int(fixture["team_h"]), str(fixture["team_h"])),
                "away": names.get(int(fixture["team_a"]), str(fixture["team_a"])),
                "home_goals": home_goals,
                "away_goals": away_goals,
                "result": result,
            }
        )
    frame = pd.DataFrame(rows)
    if frame.empty:
        return frame
    return frame.sort_values(["gameweek", "kickoff", "home_id"]).reset_index(drop=True)


def add_coming_in_features(matches: pd.DataFrame) -> pd.DataFrame:
    gf: dict[int, int] = defaultdict(int)
    ga: dict[int, int] = defaultdict(int)
    played: dict[int, int] = defaultdict(int)
    form: dict[int, deque[int]] = defaultdict(lambda: deque(maxlen=FORM_WINDOW))
    rows = []
    for row in matches.itertuples(index=False):
        home_id, away_id = row.home_id, row.away_id
        rows.append(
            {
                **row._asdict(),
                "home_gf": gf[home_id],
                "home_ga": ga[home_id],
                "home_played": played[home_id],
                "home_form": sum(form[home_id]),
                "away_gf": gf[away_id],
                "away_ga": ga[away_id],
                "away_played": played[away_id],
                "away_form": sum(form[away_id]),
            }
        )
        gf[home_id] += row.home_goals
        ga[home_id] += row.away_goals
        gf[away_id] += row.away_goals
        ga[away_id] += row.home_goals
        played[home_id] += 1
        played[away_id] += 1
        if row.result == "H":
            form[home_id].append(3)
            form[away_id].append(0)
        elif row.result == "A":
            form[home_id].append(0)
            form[away_id].append(3)
        else:
            form[home_id].append(1)
            form[away_id].append(1)
    return pd.DataFrame(rows)


FEATURE_COLS = [
    "home_gf",
    "home_ga",
    "home_played",
    "home_form",
    "away_gf",
    "away_ga",
    "away_played",
    "away_form",
]


def train_and_score(matches: pd.DataFrame) -> None:
    if matches.empty:
        print("No finished matches loaded yet. Fill the table, then train.")
        return

    cut = max(int(matches["gameweek"].max() * 0.7), matches["gameweek"].min())
    train = matches[matches["gameweek"] <= cut]
    test = matches[matches["gameweek"] > cut]
    if test.empty or train.empty:
        print("Not enough finished gameweeks yet to split train/test.")
        return

    model = RandomForestClassifier(n_estimators=200, random_state=17)
    model.fit(train[FEATURE_COLS], train["result"])
    pred = model.predict(test[FEATURE_COLS])
    acc = accuracy_score(test["result"], pred)
    n = len(test)
    print(
        f"On the last {n} finished matches, this toy model was right {acc:.0%} of the time. Not a tip."
    )


def main() -> None:
    finished = load_finished()
    print(f"Finished matches: {len(finished)}")
    if finished.empty:
        return
    featured = add_coming_in_features(finished)
    print(featured[["gameweek", "home", "away", "result", "home_form", "away_form"]].head(8).to_string(index=False))
    train_and_score(featured)


if __name__ == "__main__":
    main()
