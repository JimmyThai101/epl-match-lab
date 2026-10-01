import type { FormResult, LabTeam } from "@/lib/lab-types";
import { formColor } from "@/lib/format";

export function TeamPicker({
  label,
  teams,
  value,
  blocked,
  onChange,
}: {
  label: string;
  teams: LabTeam[];
  value: number;
  blocked: number;
  onChange: (id: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <select
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-emerald-500/30 focus:ring-2"
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
}: {
  label: string;
  value: string;
  meaning: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-[11px] leading-snug text-slate-500">{meaning}</p>
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
}: {
  label: string;
  left: number;
  right: number;
  leftName: string;
  rightName: string;
}) {
  const total = Math.abs(left) + Math.abs(right);
  const leftShare = total === 0 ? 50 : Math.round((Math.abs(left) / total) * 100);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
        <span>
          {leftName} {left}
        </span>
        <span>{label}</span>
        <span>
          {right} {rightName}
        </span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-slate-200">
        <span className="bg-slate-900" style={{ width: `${leftShare}%` }} />
        <span className="bg-emerald-500" style={{ width: `${100 - leftShare}%` }} />
      </div>
    </div>
  );
}
