import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
        A calm start
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
        EPL Match Lab
      </h1>
      <p className="mt-3 text-lg text-slate-600">Premier League match analysis, in plain English.</p>

      <section className="mt-10 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-600">
        <h2 className="text-base font-semibold text-slate-900">If you have never watched soccer</h2>
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
          Numbers here come from public feeds, not from a paid scrape. If a coach, wage, or contract
          date is not listed, we leave it blank.
        </p>
        <p>
          Inside the lab you can pick any two clubs, read the league table, check scores and upcoming
          dates, search players, and open a short glossary. Start with the snapshot; the rest is
          optional.
        </p>
      </section>

      <Link
        href="/lab"
        className="mt-8 inline-flex w-fit items-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Enter the lab
      </Link>
    </main>
  );
}
