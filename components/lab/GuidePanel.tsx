import { PitchMap } from "@/components/lab/PitchMap";

const GROUPS = [
  {
    title: "The match",
    items: [
      { term: "Goal", meaning: "Ball in the net. More goals wins." },
      { term: "Draw", meaning: "Same score. 1 point each." },
      { term: "Home", meaning: "Playing at their stadium. Always on the left here." },
      { term: "Away", meaning: "The visitors. Always on the right here." },
    ],
  },
  {
    title: "The table",
    items: [
      { term: "Win / draw / loss", meaning: "Win = 3 pts. Draw = 1. Loss = 0." },
      { term: "GD", meaning: "Goals scored minus goals let in." },
      { term: "Form", meaning: "Last results: W win, D draw, L loss." },
    ],
  },
  {
    title: "Lab numbers",
    items: [
      { term: "Goals / game", meaning: "How often they score." },
      { term: "Conceded / game", meaning: "How often they let a goal in." },
      { term: "xG", meaning: "How good the chances were, not only luck." },
      { term: "Play", meaning: "A fake 90 minutes from those rates. Not a real result." },
    ],
  },
  {
    title: "Watch colours",
    items: [
      { term: "Red", meaning: "Injury or fitness doubt." },
      { term: "Orange", meaning: "Suspended / banned." },
      { term: "Purple", meaning: "Transfer or loan news." },
      { term: "Green", meaning: "In form — scoring or creating lately." },
    ],
  },
];

export function GuidePanel() {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Words</h2>
        <p className="mt-1 text-sm text-slate-600">Short meanings. Tap a position on the pitch first.</p>
      </section>
      <PitchMap />
      {GROUPS.map((group) => (
        <section key={group.title} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-slate-900">{group.title}</h3>
          <dl className="mt-3 divide-y divide-slate-100">
            {group.items.map((item) => (
              <div key={item.term} className="flex gap-4 py-3">
                <dt className="w-28 shrink-0 text-sm font-semibold text-slate-900">{item.term}</dt>
                <dd className="text-sm leading-6 text-slate-600">{item.meaning}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
