import { getLeagueSnapshot } from "@/lib/league";

export const revalidate = 1800;

export async function GET() {
  try {
    const snapshot = await getLeagueSnapshot();
    return Response.json(snapshot);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "League data could not be loaded.";
    return Response.json({ error: message }, { status: 502 });
  }
}
