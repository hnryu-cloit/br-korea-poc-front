import { cn } from "@/lib/utils";
import type { HighlightStat } from "@/commons/constants/page-content";

const toneClassMap: Record<
  NonNullable<HighlightStat["tone"]>,
  { value: string; border: string; bg: string }
> = {
  default: { value: "text-slate-800", border: "border-slate-200", bg: "bg-slate-50/70" },
  primary: { value: "text-[#2454C8]", border: "border-[#dbe6fb]", bg: "bg-[#f4f8ff]" },
  danger: { value: "text-red-600", border: "border-red-200", bg: "bg-red-50/60" },
  success: { value: "text-green-600", border: "border-green-200", bg: "bg-green-50/60" },
};

export function StatCard({ label, value, tone = "default" }: HighlightStat) {
  return (
    <article
      className={cn(
        "rounded-2xl border px-4 py-4 shadow-[0_8px_22px_rgba(16,32,51,0.05)]",
        toneClassMap[tone].border,
        toneClassMap[tone].bg,
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
        {label}
      </p>
      <p className={cn("mt-2 text-3xl font-bold leading-none", toneClassMap[tone].value)}>
        {value}
      </p>
    </article>
  );
}
