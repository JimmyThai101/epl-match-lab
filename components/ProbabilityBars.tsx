type ProbabilityBarsProps = {
  homeLabel: string;
  awayLabel: string;
  homeWinPct: number;
  drawPct: number;
  awayWinPct: number;
  homeColor: string;
  awayColor: string;
};

export function ProbabilityBars({
  homeLabel,
  awayLabel,
  homeWinPct,
  drawPct,
  awayWinPct,
  homeColor,
  awayColor,
}: ProbabilityBarsProps) {
  const rows = [
    { label: `${homeLabel} Win`, value: homeWinPct, color: homeColor },
    { label: "Draw", value: drawPct, color: "#94a3b8" },
    { label: `${awayLabel} Win`, value: awayWinPct, color: awayColor },
  ];

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-slate-300">{row.label}</span>
            <span className="font-medium tabular-nums text-white">{row.value}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{ width: `${row.value}%`, backgroundColor: row.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
