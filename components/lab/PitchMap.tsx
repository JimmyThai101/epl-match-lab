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
      <p className="mt-1 text-sm text-slate-600">Tap a dot. The arrow is the way they attack.</p>
      <div className="mx-auto mt-4 flex max-w-sm items-stretch gap-2">
        <div
          className="relative aspect-[2/3] min-w-0 flex-1 overflow-hidden rounded-xl border border-white/30"
          style={{
            background:
              "repeating-linear-gradient(180deg, #157a3a 0 12.5%, #1b8a44 12.5% 25%)",
          }}
        >
          <div className="absolute inset-2 rounded-md border-2 border-white/60" />
          <div className="absolute inset-x-2 top-1/2 h-px bg-white/60" />
          <div className="absolute inset-x-[22%] top-2 h-[16%] border-2 border-t-0 border-white/55" />
          <div className="absolute inset-x-[34%] top-2 h-[8%] border-2 border-t-0 border-white/70" />
          <div className="absolute left-1/2 top-0.5 h-2 w-9 -translate-x-1/2 border-2 border-t-0 border-white bg-white/20" />
          <div className="absolute inset-x-[22%] bottom-2 h-[16%] border-2 border-b-0 border-white/55" />
          <div className="absolute inset-x-[34%] bottom-2 h-[8%] border-2 border-b-0 border-white/70" />
          <div className="absolute bottom-0.5 left-1/2 h-2 w-9 -translate-x-1/2 border-2 border-b-0 border-white bg-white/20" />
          {SPOTS.map((spot) => (
            <button
              key={spot.id}
              type="button"
              onClick={() => setOpen(spot.id)}
              className={`absolute z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full text-xs font-bold shadow ${spot.className} ${
                open === spot.id ? "bg-white text-slate-900" : "bg-slate-950/70 text-white"
              }`}
            >
              {spot.label}
            </button>
          ))}
        </div>
        <div className="flex w-11 shrink-0 flex-col items-center justify-center gap-1 text-slate-700">
          <span className="text-[10px] font-semibold uppercase tracking-wide">Attack</span>
          <svg viewBox="0 0 24 88" className="h-24 w-5" aria-hidden="true">
            <path
              d="M12 4 L12 78"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path d="M5 14 L12 4 L19 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-center text-[10px] leading-tight text-slate-500">this way</span>
        </div>
      </div>
      <p className="mt-4 text-base font-semibold text-slate-900">{active.name}</p>
      <p className="mt-1 text-sm text-slate-600">{active.blurb}</p>
    </section>
  );
}
