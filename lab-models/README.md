# Lab models (not the website)

These notebooks are **experiments in this folder**. They are not the live site at [https://epl-match-lab-rho.vercel.app/](https://epl-match-lab-rho.vercel.app/). The Next.js app already has Scout, Play, and 300 sample rolls.

Fees and win/draw/loss scores here are homework models. They are not scout valuations and not tips for Saturday. If a licensed source has no listed fee, that column stays blank. Do not scrape Transfermarkt.

## Setup (Windows)

1. Install [Python 3.12](https://www.python.org/downloads/) and tick **Add python.exe to PATH**.
2. In a new terminal, from this `lab-models` folder:

```text
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

3. Sign up at [football-data.org](https://www.football-data.org) (free tier). Paste the token into `.env` as `FOOTBALL_DATA_TOKEN=...`.
4. Open `01-lab-value.ipynb` then `02-match-model.ipynb` in Cursor. Pick the `.venv` kernel.

Rate limits and the Premier League competition id (`2021`) are in their docs. Stay inside what the free tier allows.

## Notebooks

- `01-lab-value.ipynb` — stats → listed fee **only on rows that have a fee**. One cell says this is not a scout’s valuation. If the API has no fees, stop. Keep the site lab index.
- `02-match-model.ipynb` — RandomForestClassifier on **finished** matches. Train on older gameweeks, test on later finished ones. Write: “On the last N finished matches, this toy model was right X% of the time.” Not a tip.

XGBoost is optional later. If `pip install xgboost` fails on Windows, stay on Random Forest.
