import { clubKey } from "@/lib/club-name";

const KITS: Record<string, { primary: string; secondary: string }> = {
  arsenal: { primary: "#EF0107", secondary: "#FFFFFF" },
  astonvilla: { primary: "#670E36", secondary: "#95BFE5" },
  bournemouth: { primary: "#DA291C", secondary: "#000000" },
  brentford: { primary: "#E30613", secondary: "#FFB81C" },
  brighton: { primary: "#0057B8", secondary: "#FFFFFF" },
  chelsea: { primary: "#034694", secondary: "#FFFFFF" },
  coventrycity: { primary: "#59B5E0", secondary: "#FFFFFF" },
  crystalpalace: { primary: "#1B458F", secondary: "#C4122E" },
  everton: { primary: "#003399", secondary: "#FFFFFF" },
  fulham: { primary: "#000000", secondary: "#FFFFFF" },
  hullcity: { primary: "#F18A01", secondary: "#000000" },
  ipswichtown: { primary: "#0033A0", secondary: "#DE2C37" },
  leeds: { primary: "#FFCD00", secondary: "#1D428A" },
  liverpool: { primary: "#C8102E", secondary: "#F6EB61" },
  mancity: { primary: "#6CABDD", secondary: "#1C2C5B" },
  manunited: { primary: "#DA291C", secondary: "#FBE122" },
  newcastle: { primary: "#241F20", secondary: "#FFFFFF" },
  nottforest: { primary: "#DD0000", secondary: "#FFFFFF" },
  spurs: { primary: "#132257", secondary: "#FFFFFF" },
  sunderland: { primary: "#EB172B", secondary: "#FFFFFF" },
};

export function kitForClub(name: string) {
  return KITS[clubKey(name)] ?? { primary: "#0F172A", secondary: "#E2E8F0" };
}

export function isLightColor(hex: string) {
  const value = hex.replace("#", "");
  if (value.length < 6) {
    return false;
  }
  const r = Number.parseInt(value.slice(0, 2), 16) / 255;
  const g = Number.parseInt(value.slice(2, 4), 16) / 255;
  const b = Number.parseInt(value.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.65;
}
