import { cn } from "@/lib/utils";
import { formatDashboardStatValue } from "@/commons/utils/dashboard-formatters";

import type { DashboardStatItem } from "@/features/dashboard/types/dashboard";

const statToneClassMap: Record<DashboardStatItem["tone"], string> = {
  danger: "text-red-600",
  primary: "text-[#2454C8]",
  success: "text-[#15803d]",
  default: "text-slate-800",
};

const statCardClassMap: Record<DashboardStatItem["tone"], string> = {
  danger: "border-red-200 bg-[#fff7f7]",
  primary: "border-[#d4e2ff] bg-[#f7faff]",
  success: "border-green-200 bg-[#f3fcf6]",
  default: "border-[#e5ebf5] bg-white",
};

export function DashboardStatsTiles({ stats }: { stats: DashboardStatItem[] }) {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <article
          key={stat.key}
          className={cn(
            "rounded-2xl border px-4 py-3 shadow-[0_6px_18px_rgba(16,32,51,0.04)]",
            statCardClassMap[stat.tone],
          )}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
            {stat.label}
          </p>
          <p className={cn("mt-2 text-2xl font-bold leading-tight", statToneClassMap[stat.tone])}>
            {formatDashboardStatValue({
              key: stat.key,
              value: stat.value,
              unit: stat.unit,
            })}
          </p>
        </article>
      ))}
    </section>
  );
}
