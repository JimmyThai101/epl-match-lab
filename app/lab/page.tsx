import Link from "next/link";
import { MatchLab } from "@/components/lab/MatchLab";

export default function LabPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">
          ← Back to intro
        </Link>
        <p className="text-sm font-medium text-slate-900">EPL Match Lab</p>
      </div>
      <MatchLab />
    </main>
  );
}
