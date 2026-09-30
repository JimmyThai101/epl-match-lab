export function formatStat(value: number, format: "number" | "percent") {
  if (format === "percent") {
    return `${value}%`;
  }

  if (Number.isInteger(value)) {
    return String(value);
  }

  const decimals = String(value).split(".")[1]?.length ?? 1;
  return value.toFixed(Math.min(2, Math.max(1, decimals)));
}

export function hasAdvantage(
  home: number,
  away: number,
  higherIsBetter: boolean,
) {
  if (home === away) {
    return "even";
  }

  const homeIsBetter = higherIsBetter ? home > away : home < away;
  return homeIsBetter ? "home" : "away";
}

export function barShare(value: number, other: number) {
  const total = value + other;
  if (total === 0) {
    return 50;
  }

  return Math.round((value / total) * 100);
}
