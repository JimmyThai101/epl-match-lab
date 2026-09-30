import { Footer } from "@/components/Footer";
import { HomeVsAway } from "@/components/HomeVsAway";
import { MatchAnalysis } from "@/components/MatchAnalysis";
import { MatchHero } from "@/components/MatchHero";
import { MatchOverview } from "@/components/MatchOverview";
import { ModelSnapshot } from "@/components/ModelSnapshot";
import { Navbar } from "@/components/Navbar";
import { PredictionHistory } from "@/components/PredictionHistory";
import { PredictionPanel } from "@/components/PredictionPanel";
import { RecentForm } from "@/components/RecentForm";
import { mockMatch } from "@/data/mock-match";

export default function Home() {
  return (
    <div className="min-h-full bg-[#07090e] text-slate-100">
      <Navbar />
      <main className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
        <MatchHero match={mockMatch} />
        <MatchOverview match={mockMatch} />
        <RecentForm home={mockMatch.home} away={mockMatch.away} />
        <HomeVsAway home={mockMatch.home} away={mockMatch.away} />
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <MatchAnalysis match={mockMatch} />
          <PredictionPanel match={mockMatch} />
        </div>
        <ModelSnapshot factors={mockMatch.modelFactors} />
        <PredictionHistory rows={mockMatch.history} />
      </main>
      <Footer />
    </div>
  );
}
