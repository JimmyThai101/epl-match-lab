"use client";

import { useState } from "react";

const SPOTS = [
  {
    id: "fwd",
    label: "FWD",
    name: "Forward",
    blurb: "Up front. Tries to score.",
    className: "top-[8%] left-1/2 -translate-x-1/2",
  },
  {
    id: "mid",
    label: "MID",
    name: "Midfielder",
    blurb: "The middle. Links defence and attack.",
    className: "top-[38%] left-1/2 -translate-x-1/2",
  },
  {
    id: "def",
    label: "DEF",
    name: "Defender",
    blurb: "Near their own goal. Stops the other team.",
    className: "top-[64%] left-1/2 -translate-x-1/2",
  },
  {
    id: "gk",
    label: "GK",
    name: "Goalkeeper",
    blurb: "Last line. Can use hands in their box.",
    className: "bottom-[6%] left-1/2 -translate-x-1/2",
  },
];

export function PitchMap() {
  const [open, setOpen] = useState<string | null>("fwd");
  const active = SPOTS.find((spot) => spot.id === open) ?? SPOTS[0];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-slate-900">Positions</h2>
      <p className="mt-1 text-sm text-slate-600">Tap a dot. Attack is the top of the picture.</p>
      <div className="mx-auto mt-4 max-w-xs">
        <div
          className="relative aspect-[2/3] overflow-hidden rounded-xl border border-white/30"
          style={{
            background:
              "repeating-linear-gradient(180deg, #157a3a 0 12.5%, #1b8a44 12.5% 25%)",
          }}
        >
          <div className="absolute inset-2 rounded-md border-2 border-white/60" />
          <div className="absolute inset-x-2 top-1/2 h-px bg-white/60" />
          {SPOTS.map((spot) => (
            <button
              key={spot.id}
              type="button"
              onClick={() => setOpen(spot.id)}
              className={`absolute flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full text-xs font-bold shadow ${spot.className} ${
                open === spot.id ? "bg-white text-slate-900" : "bg-slate-950/70 text-white"
              }`}
            >
              {spot.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-4 text-base font-semibold text-slate-900">{active.name}</p>
      <p className="mt-1 text-sm text-slate-600">{active.blurb}</p>
    </section>
  );
}
