import { formColor } from "@/lib/format";
import { isLightColor } from "@/lib/kit-colors";
import type { FormResult, LabTeam } from "@/lib/lab-types";

export function TeamPicker({
  label,
  teams,
  value,
  blocked,
  onChange,
  accent,
}: {
  label: string;
  teams: LabTeam[];
  value: number;
  blocked: number;
  onChange: (id: number) => void;
  accent: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
        {label}
      </span>
      <select
        className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-slate-900 outline-none focus:ring-2 sm:min-h-11 sm:py-2.5 sm:text-sm"
        style={{ boxShadow: `inset 4px 0 0 ${accent}` }}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {teams.map((team) => (
          <option key={team.id} value={team.id} disabled={team.id === blocked}>
            {team.position ? `${team.position}. ` : ""}
            {team.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Stat({
  label,
  value,
  meaning,
  accent,
}: {
  label: string;
  value: string;
  meaning: string;
  accent?: string;
}) {
  return (
    <div
      className="rounded-xl bg-slate-50 px-2.5 py-3 sm:px-3"
      style={accent ? { boxShadow: `inset 4px 0 0 ${accent}` } : undefined}
    >
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-[11px] leading-snug text-slate-500 sm:block">{meaning}</p>
    </div>
  );
}

export function FormPills({ form }: { form: FormResult[] }) {
  if (form.length === 0) {
    return <span className="text-xs text-slate-400">No form yet</span>;
  }

  return (
    <span className="inline-flex gap-1">
      {form.map((result, index) => (
        <span
          key={`${result}-${index}`}
          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${formColor(result)}`}
        >
          {result}
        </span>
      ))}
    </span>
  );
}

export function CompareBar({
  label,
  left,
  right,
  leftName,
  rightName,
  leftColor,
  rightColor,
}: {
  label: string;
  left: number;
  right: number;
  leftName: string;
  rightName: string;
  leftColor: string;
  rightColor: string;
}) {
  const total = Math.abs(left) + Math.abs(right);
  const leftShare = total === 0 ? 50 : Math.round((Math.abs(left) / total) * 100);

  const leftText = isLightColor(leftColor) ? "#0f172a" : leftColor;
  const rightText = isLightColor(rightColor) ? "#0f172a" : rightColor;

  return (
    <div>
      <p className="mb-1 text-center text-[11px] text-slate-500 sm:hidden">{label}</p>
      <div className="mb-1.5 flex items-center justify-between gap-2 text-xs text-slate-500">
        <span className="inline-flex min-w-0 items-center gap-1.5 font-medium" style={{ color: leftText }}>
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: leftColor }} />
          <span className="truncate">
            {leftName} {left}
          </span>
        </span>
        <span className="hidden shrink-0 sm:inline">{label}</span>
        <span className="inline-flex min-w-0 items-center justify-end gap-1.5 font-medium" style={{ color: rightText }}>
          <span className="truncate">
            {right} {rightName}
          </span>
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: rightColor }} />
        </span>
      </div>
      <div className="flex h-3 overflow-hidden rounded-full bg-slate-200 sm:h-2.5">
        <span style={{ width: `${leftShare}%`, background: leftColor }} />
        <span style={{ width: `${100 - leftShare}%`, background: rightColor }} />
      </div>
    </div>
  );
}
