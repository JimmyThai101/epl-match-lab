const TIPS = [
  { label: "Goal", blurb: "Ball in the net." },
  { label: "Home", blurb: "Left side." },
  { label: "Away", blurb: "Right side." },
  { label: "xG", blurb: "Chance quality." },
];

export function WordTips({ onOpenWords }: { onOpenWords: () => void }) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-amber-950">Stuck on a word?</h2>
        <button
          type="button"
          onClick={onOpenWords}
          className="min-h-11 rounded-full bg-amber-900 px-4 py-2 text-sm font-semibold text-amber-50"
        >
          Open Words
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {TIPS.map((tip) => (
          <button
            key={tip.label}
            type="button"
            onClick={onOpenWords}
            className="rounded-full bg-white px-3 py-1.5 text-sm text-amber-950 ring-1 ring-amber-200"
          >
            <span className="font-semibold">{tip.label}</span>
            <span className="text-amber-800/80"> · {tip.blurb}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
