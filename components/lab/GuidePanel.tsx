export function GuidePanel() {
  const items = [
    {
      term: "Goal",
      meaning: "The ball crosses the goal line. The team with more goals wins.",
    },
    {
      term: "Draw",
      meaning: "Both teams finish with the same number of goals.",
    },
    {
      term: "Table",
      meaning: "A ranking of all 20 clubs. Win = 3 points, draw = 1, loss = 0.",
    },
    {
      term: "Form",
      meaning: "The last few league results. W win, D draw, L loss.",
    },
    {
      term: "xG",
      meaning: "Expected goals. A guess at how many goals the chances were worth.",
    },
    {
      term: "Clean sheet",
      meaning: "The team did not let in a goal.",
    },
    {
      term: "FPL price",
      meaning: "A made-up cost in the Fantasy Premier League game, not a real wage.",
    },
    {
      term: "Fixture rating",
      meaning: "FPL’s 1–5 difficulty for that matchup. 5 is usually tougher.",
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-900">Words for first-time fans</h2>
      <dl className="mt-4 divide-y divide-slate-100">
        {items.map((item) => (
          <div key={item.term} className="py-3 sm:flex sm:gap-6">
            <dt className="w-36 shrink-0 text-sm font-medium text-slate-900">{item.term}</dt>
            <dd className="text-sm leading-6 text-slate-600">{item.meaning}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
