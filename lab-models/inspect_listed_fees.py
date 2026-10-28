"""Inspect football-data.org for listed transfer fees. Does not train.

marketValue is a valuation, not a listed fee. Do not use it as Y.
"""

from __future__ import annotations

from typing import Any

from fd_client import FootballDataClient

PL_ID = 2021
FEE_KEYS = {"listed_fee", "listedfee", "transfer_fee", "transferfee", "fee"}
VALUATION_KEYS = {"marketvalue", "market_value"}


def walk_keys(obj: Any, found: set[str] | None = None) -> set[str]:
    found = found if found is not None else set()
    if isinstance(obj, dict):
        found.update(obj.keys())
        for value in obj.values():
            walk_keys(value, found)
    elif isinstance(obj, list):
        for item in obj:
            walk_keys(item, found)
    return found


def classify_keys(keys: set[str]) -> tuple[list[str], list[str]]:
    listed: list[str] = []
    valuations: list[str] = []
    for key in sorted(keys):
        compact = key.lower().replace(" ", "")
        if compact in FEE_KEYS:
            listed.append(key)
        if compact in VALUATION_KEYS:
            valuations.append(key)
    return listed, valuations


def main() -> None:
    client = FootballDataClient()
    competition = client.get(f"/competitions/{PL_ID}")
    start = str(competition.get("currentSeason", {}).get("startDate", "2026-08-21"))
    season = start[:4]
    print(f"Competition: {competition.get('name')} id={competition.get('id')} season={season}")

    teams_payload = client.get(f"/competitions/{PL_ID}/teams", {"season": season})
    teams = teams_payload.get("teams") or []
    print(f"Teams in payload: {len(teams)}")

    sample = teams[0] if teams else {}
    if not sample.get("squad"):
        team_id = sample.get("id")
        if team_id is None:
            raise SystemExit("No teams returned; cannot inspect squad fields.")
        sample = client.get(f"/teams/{team_id}")

    keys = walk_keys(sample)
    listed, valuations = classify_keys(keys)
    squad = sample.get("squad") or []
    squad_keys = walk_keys(squad[0]) if squad else set()
    listed_squad, valuations_squad = classify_keys(squad_keys)

    print("Sample club:", sample.get("name"))
    print("Squad size:", len(squad))
    print("Squad field names:", sorted(squad_keys) or "(empty)")
    print("Listed-fee fields on club/squad:", listed + listed_squad or "none")
    print("Valuation fields (not listed fees):", valuations + valuations_squad or "none")

    if listed or listed_squad:
        print("Listed fees exist. Train only on rows that have a fee.")
    else:
        print(
            "No listed transfer fees in this API. Stop. "
            "Keep the website lab index. Do not train on marketValue. "
            "This is not a scout's valuation."
        )


if __name__ == "__main__":
    main()
