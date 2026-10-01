export function clubKey(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/f\.c\.|a\.f\.c\./g, "")
    .replace(/\bafc\b/g, "")
    .replace(/nottingham/g, "nott")
    .replace(/nott'm/g, "nott")
    .replace(/manchester/g, "man")
    .replace(/\butd\b/g, "united")
    .replace(/tottenham hotspur|\bspurs\b/g, "spurs")
    .replace(/brighton and hove albion|brighton/g, "brighton")
    .replace(/wolverhampton wanderers|\bwolves\b/g, "wolves")
    .replace(/west ham united|west ham/g, "westham")
    .replace(/[^a-z0-9]/g, "");
}

export function namesLikelyMatch(a: string, b: string) {
  const left = a.toLowerCase().trim();
  const right = b.toLowerCase().trim();
  if (!left || !right) {
    return false;
  }
  if (left === right) {
    return true;
  }
  const last = (value: string) => value.split(" ").filter(Boolean).at(-1) ?? "";
  return last(left) === last(right) && last(left).length > 3;
}
