import {
  fetchSportsDbClub,
  fetchSportsDbPlayers,
  toContractNotes,
} from "@/lib/sportsdb";

export const revalidate = 86400;

export async function GET(request: Request) {
  const name = new URL(request.url).searchParams.get("name")?.trim() ?? "";
  if (!name) {
    return Response.json({ error: "Missing team name." }, { status: 400 });
  }

  try {
    const club = await fetchSportsDbClub(name);
    const players = club ? await fetchSportsDbPlayers(club.id) : [];
    const contracts = toContractNotes(players);

    return Response.json({
      stadium: club?.stadium || null,
      location: club?.location || null,
      contracts,
      note: club
        ? "Wage and signing figures are community-reported on TheSportsDB. They can be incomplete, old, or missing. Fantasy Premier League prices are game values, not real salaries."
        : "No extra club notes were found for this name.",
    });
  } catch {
    return Response.json({
      stadium: null,
      location: null,
      contracts: [],
      note: "Extra club notes are unavailable right now.",
    });
  }
}
