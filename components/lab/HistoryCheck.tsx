import { historyCheckSentence } from "@/lib/history-check";

export function HistoryCheck() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:px-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Past weeks</p>
      <p className="mt-1 text-sm font-semibold leading-6 text-slate-900">{historyCheckSentence()}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">
        Saved from the lab-models random forest on finished FPL matches. It is separate from the sample match above.
      </p>
    </section>
  );
}
