import type { MatchDashboard } from "@/types/match";

export function MatchHero({ match }: { match: MatchDashboard }) {
  return (
    <section
      id="match"
      className="scroll-mt-20 overflow-hidden rounded-2xl border border-white/8 bg-[linear-gradient(180deg,#141a24_0%,#0d1118_100%)]"
    >
      <div className="border-b border-white/6 px-5 py-3 text-center text-xs tracking-widest text-slate-400 uppercase sm:px-8">
        {match.competition}
      </div>

      <div className="grid items-center gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_auto_1fr] lg:py-10">
        <TeamBlock
          name={match.home.name}
          shortName={match.home.shortName}
          side="Home"
          color={match.home.accent}
          align="right"
        />

        <div className="text-center">
          <p className="text-sm font-semibold tracking-[0.35em] text-slate-500">
            VS
          </p>
          <p className="mt-3 text-sm text-slate-300">{match.kickoffLabel}</p>
          <p className="mt-1 text-xs text-slate-500">{match.venue}</p>
        </div>

        <TeamBlock
          name={match.away.name}
          shortName={match.away.shortName}
          side="Away"
          color={match.away.accent}
          align="left"
        />
      </div>

      <div className="flex justify-center border-t border-white/6 px-5 py-4 sm:px-8">
        <a
          href="#analysis"
          className="inline-flex items-center rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
        >
          Analyze Match
        </a>
      </div>
    </section>
  );
}

function TeamBlock({
  name,
  shortName,
  side,
  color,
  align,
}: {
  name: string;
  shortName: string;
  side: string;
  color: string;
  align: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-center lg:text-right" : "text-center lg:text-left"}>
      <p className="text-[11px] font-medium tracking-[0.2em] text-slate-500 uppercase">
        {side}
      </p>
      <p className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        {name.toUpperCase()}
      </p>
      <p className="mt-2 text-sm font-medium" style={{ color }}>
        {shortName}
      </p>
    </div>
  );
}
