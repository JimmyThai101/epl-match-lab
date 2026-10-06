import Link from "next/link";
import { MatchLab } from "@/components/lab/MatchLab";

export default function LabPage() {
  return (
    <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-5 flex items-center justify-between gap-3 sm:mb-8">
        <Link href="/" className="min-h-11 py-2 text-sm text-slate-500 hover:text-slate-900">
          ← Back to intro
        </Link>
        <p className="text-sm font-medium text-slate-900">EPL Match Lab</p>
      </div>
      <MatchLab />
    </main>
  );
}
