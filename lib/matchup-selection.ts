export type SelectableTeam = { id: number; name: string };

export type MatchupRequest = {
  home?: number | null;
  away?: number | null;
};

export function resolveMatchup(teams: SelectableTeam[], requested: MatchupRequest) {
  const ids = teams.map((team) => team.id);
  const byId = new Set(ids);

  const preferredHome =
    teams.find((team) => team.name === "Arsenal")?.id ?? ids[0] ?? null;
  const preferredAway =
    teams.find((team) => team.name === "Man City")?.id ??
    ids.find((id) => id !== preferredHome) ??
    null;

  const home = byId.has(requested.home ?? NaN) ? requested.home! : preferredHome;
  const awayCandidates = ids.filter((id) => id !== home);
  const requestedAway = requested.away ?? null;
  const away =
    requestedAway !== null && byId.has(requestedAway) && requestedAway !== home
      ? requestedAway
      : awayCandidates.includes(preferredAway ?? -1)
        ? preferredAway
        : (awayCandidates[0] ?? null);

  return { homeId: home, awayId: away };
}

export function differentClub(homeId: number | null, awayId: number | null) {
  return homeId !== null && awayId !== null && homeId !== awayId;
}
