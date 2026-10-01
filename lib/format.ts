export function formatKickoff(value: string | null) {
  if (!value) {
    return "Time TBC";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Time TBC";
  }

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
  }).format(date);
}

export function difficultyLabel(value: number) {
  if (value <= 2) return "easier";
  if (value >= 4) return "tougher";
  return "middling";
}

export function statusLabel(status: string) {
  if (status === "a") return "Available";
  if (status === "i") return "Injured";
  if (status === "d") return "Doubtful";
  if (status === "s") return "Suspended";
  if (status === "u") return "Unavailable";
  return status;
}

export function formColor(result: string) {
  if (result === "W") return "bg-emerald-600 text-white";
  if (result === "L") return "bg-rose-600 text-white";
  return "bg-slate-300 text-slate-800";
}
