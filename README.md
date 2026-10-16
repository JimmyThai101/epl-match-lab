# EPL Match Lab

A calm Premier League comparison site for people who want to pick two clubs, read the matchup in plain English, and explore how a simplified sample match can finish different ways.

This is an educational lab, not an official Premier League product and not a betting tool.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Pick two clubs on the homepage, then **Compare clubs**.

```bash
npm test
npm run build
```

## What it does

- Compare any two current Premier League clubs (home always left).
- Show scoring and conceding rates, recent form, and a short reading.
- Play one sample 90 minutes, or roll hundreds of samples from those rates.
- Browse the table, fixtures in your timezone, squads, and listed wage notes when they exist.
- Explain football words in place (`?` buttons) and in the Words tab.

## Stack

Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript.

## Data sources and limits

- **Fantasy Premier League** public JSON: squads, player stats, fixtures, live-ish scores.
- **Wikidata**: coaches, when listed.
- **TheSportsDB**: wages and stadium notes, when listed.

If the fixture feed fails, the lab shows an error instead of a table of zeros. Missing coaches, stadiums, or wages stay blank. Squad xG is the sum of current FPL player xG, not a match-by-match club total.

The sample match uses season goals-per-game and goals-conceded-per-game. Percentages from many samples describe that model only. They are not a validated forecast.

## Tests

`npm test` covers standings math, failed fixture requests, duplicate club selection, and simulation repeatability.
