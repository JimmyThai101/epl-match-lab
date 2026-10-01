import { clubKey } from "@/lib/club-name";

const QUERY = `SELECT DISTINCT ?clubLabel ?managerLabel WHERE {
  ?club wdt:P31 wd:Q476028.
  ?club wdt:P118 wd:Q9448.
  OPTIONAL { ?club wdt:P286 ?manager. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}`;

type Binding = {
  clubLabel?: { value: string };
  managerLabel?: { value: string };
};

export async function fetchWikidataManagers() {
  const url =
    "https://query.wikidata.org/sparql?format=json&query=" +
    encodeURIComponent(QUERY);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "EPLMatchLab/1.0 (educational)",
        Accept: "application/sparql-results+json",
      },
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return new Map<string, string>();
    }

    const json = (await response.json()) as { results?: { bindings?: Binding[] } };
    const map = new Map<string, string>();

    for (const row of json.results?.bindings ?? []) {
      const club = row.clubLabel?.value;
      const manager = row.managerLabel?.value;
      if (!club || !manager || manager === club) {
        continue;
      }
      map.set(clubKey(club), manager);
    }

    return map;
  } catch {
    return new Map<string, string>();
  }
}
