import { cn } from "@/lib/utils";
import type { HighlightStat } from "@/data/page-content";

const toneClassMap: Record<NonNullable<HighlightStat["tone"]>, string> = {
  default: "bg-white text-slate-800",
  primary: "bg-[#eef4ff] text-[#2454c8]",
  danger: "bg-[#fff1f1] text-[#d14343]",
  success: "bg-[#eefaf2] text-[#15803d]",
};

export function StatCard({ label, value, tone = "default" }: HighlightStat) {
  return (
    <article className="rounded-[26px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <div className={cn("mt-4 inline-flex rounded-full px-3 py-1 text-sm font-semibold", toneClassMap[tone])}>{value}</div>
    </article>
  );
}
