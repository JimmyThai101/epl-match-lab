const TIPS = [
  { label: "Goal", blurb: "Ball in the net. More of these wins the match." },
  { label: "xG", blurb: "How good the chances were, not only the luck." },
  { label: "Form", blurb: "Last few results: W win, D draw, L loss." },
  { label: "Table", blurb: "3 points for a win, 1 for a draw, 0 for a loss." },
  { label: "Sample match", blurb: "A practice game rolled from season rates, not a prediction." },
];

export function WordTips({ onOpenWords }: { onOpenWords: () => void }) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-amber-950">New to soccer? Start here</h2>
          <p className="mt-1 text-sm leading-6 text-amber-900/80">
            Words is the lab&apos;s dictionary. It is not buried — tap it any time, including the
            chips below.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenWords}
          className="min-h-11 rounded-full bg-amber-900 px-4 py-2 text-sm font-semibold text-amber-50"
        >
          Open Words
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {TIPS.map((tip) => (
          <button
            key={tip.label}
            type="button"
            onClick={onOpenWords}
            className="rounded-full bg-white px-3 py-2 text-left text-sm text-amber-950 ring-1 ring-amber-200"
          >
            <span className="font-semibold">{tip.label}</span>
            <span className="mt-0.5 block text-[11px] font-normal text-amber-800/80">
              {tip.blurb}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
