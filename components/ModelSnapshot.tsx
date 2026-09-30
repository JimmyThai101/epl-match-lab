import { Card } from "@/components/Card";

export function ModelSnapshot({ factors }: { factors: string[] }) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-white">Model snapshot</h2>
      <p className="mt-1 text-sm text-slate-400">
        Inputs the future model will weigh. No machine-learning is running yet.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {factors.map((factor) => (
          <div
            key={factor}
            className="rounded-lg border border-white/8 bg-white/[0.03] px-3 py-3 text-sm text-slate-200 transition-colors hover:border-white/16 hover:bg-white/[0.05]"
          >
            {factor}
          </div>
        ))}
      </div>
    </Card>
  );
}
