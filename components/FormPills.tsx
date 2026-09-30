import type { FormResult } from "@/types/match";

const styles: Record<FormResult, string> = {
  W: "bg-emerald-500/20 text-emerald-300 border-emerald-400/25",
  D: "bg-amber-500/15 text-amber-200 border-amber-400/25",
  L: "bg-rose-500/15 text-rose-300 border-rose-400/25",
};

export function FormPills({ form }: { form: FormResult[] }) {
  return (
    <div className="flex gap-1.5">
      {form.map((result, index) => (
        <span
          key={`${result}-${index}`}
          className={`flex h-7 w-7 items-center justify-center rounded-md border text-xs font-semibold ${styles[result]}`}
        >
          {result}
        </span>
      ))}
    </div>
  );
}
