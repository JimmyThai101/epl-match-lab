# Lab models (not the website)

These notebooks are **experiments in this folder**. They are not the live site at [https://epl-match-lab-rho.vercel.app/](https://epl-match-lab-rho.vercel.app/). The Next.js app already has Scout, Play, and 300 sample rolls.

Fees and win/draw/loss scores here are homework models. They are not scout valuations and not tips for Saturday. If a licensed source has no listed fee, that column stays blank. Do not scrape Transfermarkt.

## Setup (Windows)

Venv is already in `lab-models/.venv`. From this folder:

```text
.venv\Scripts\python.exe inspect_listed_fees.py
.venv\Scripts\python.exe match_model.py
```

Jupyter is optional. Open the notebooks later if you want; the `.py` files are the same work.

Football data provided by the Football-Data.org API.

Free tier: 10 calls per minute. The helper `fd_client.py` waits at least 7 seconds between calls, reads `X-RequestsAvailable` and `X-RequestCounter-Reset`, and caches responses in `lab-models/cache/` so reruns do not spend quota. If remaining calls drop to 2 or fewer, it sleeps until the counter resets.

## Notebooks

- `01-lab-value.ipynb` / `inspect_listed_fees.py` — football-data.org squad fields on this free tier are name, position, nationality, date of birth. **No listed transfer fee.** Stop. Keep the site lab index. Do not train on `marketValue` if it appears later; that is a valuation, not a listed fee.
- `02-match-model.ipynb` / `match_model.py` — RandomForestClassifier on finished FPL matches (form + goals for/against coming in). Last run: **On the last 30 finished matches, this toy model was right 33% of the time. Not a tip.**

XGBoost is optional later. If `pip install xgboost` fails on Windows, stay on Random Forest.

Do not paste the API token in chat. If it was pasted already, regenerate it on football-data.org and update only `lab-models/.env`.
