import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
        A calm start
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        EPL Match Lab
      </h1>
      <p className="mt-3 text-lg text-slate-600">Premier League match analysis, in plain English.</p>

      <section className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-4 text-base leading-7 text-slate-600 sm:mt-10 sm:p-6 sm:leading-8">
        <h2 className="text-xl font-semibold text-slate-900">If you have never watched soccer</h2>
        <p>
          Two teams of 11 try to put the ball in the other team&apos;s goal. The side with more goals
          after about 90 minutes wins. A draw means they scored the same number.
        </p>
        <p>
          The Premier League is England&apos;s top division. Twenty clubs play each other over a
          season. This lab lets you pick any two of those clubs and compare how they have been
          scoring and defending so far.
        </p>
        <p>
          Each club keeps its kit color on stats and photos, so you can tell whose numbers are whose.
          On the snapshot, similar players are shown in profile facing each other.
        </p>
        <p>
          Numbers here come from public feeds, not from a paid scrape. If a coach, wage, or contract
          date is not listed, we leave it blank.
        </p>
        <p>
          Inside the lab, open <strong>Words</strong> for a longer glossary. Start with the snapshot;
          the rest is optional.
        </p>
      </section>

      <Link
        href="/lab"
        className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white hover:bg-slate-800 sm:w-fit sm:text-sm"
      >
        Enter the lab
      </Link>
    </main>
  );
}
