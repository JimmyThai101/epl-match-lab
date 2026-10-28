import { fetchFplBootstrap } from "@/lib/fpl";
import { buildShareCard, DEFAULT_SHARE, type ShareSearch } from "@/lib/share";

export async function shareCardFromSearch(search: ShareSearch) {
  try {
    const fpl = await fetchFplBootstrap();
    return buildShareCard({
      teams: fpl.teams.map((team) => ({
        id: team.id,
        name: team.name,
        shortName: team.short_name,
      })),
      players: fpl.elements.map((player) => ({
        id: player.id,
        webName: player.web_name,
      })),
      search,
    });
  } catch {
    return DEFAULT_SHARE;
  }
}
