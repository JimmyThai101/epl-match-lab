import type { Metadata } from "next";
import { HomeMatchupPicker } from "@/components/lab/HomeMatchupPicker";
import { homeMetadata } from "@/lib/page-metadata";
import Link from "next/link";

export const metadata: Metadata = homeMetadata();

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
        EPL Match Lab
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        Pick two clubs. Understand the matchup.
      </h1>
      <p className="mt-3 text-lg text-slate-600">
        Home on the left, away on the right. You can compare in a minute — read this first if soccer is new.
      </p>

      <section className="mt-8 rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-800">
          New to football?
        </p>
        <h2 className="mt-2 text-xl font-semibold text-amber-950">The 60-second version</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-amber-950/90">
          <li>Two teams of 11. Kick the ball into the other net. More goals after ~90 minutes wins. Same score is a draw.</li>
          <li>The Premier League is England&apos;s top division — 20 clubs.</li>
          <li>
            <strong>Home</strong> plays at their stadium (always left here). <strong>Away</strong> are the visitors (right).
          </li>
          <li>
            This site compares how often they score and concede. It does not predict tonight&apos;s result.
          </li>
        </ul>
        <Link
          href="/lab?tab=guide"
          className="mt-4 inline-flex min-h-12 items-center justify-center rounded-full bg-amber-900 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-800"
        >
          Open Words (plain-English dictionary)
        </Link>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">Then pick two clubs</h2>
        <p className="mt-1 text-sm text-slate-600">
          Compare whenever you are ready. Words stays one tap away inside the lab too.
        </p>
        <div className="mt-5">
          <HomeMatchupPicker />
        </div>
      </section>
    </main>
  );
}
