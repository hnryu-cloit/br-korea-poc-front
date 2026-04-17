import type { ReactNode } from "react";
import { Clock } from "lucide-react";

import { StatCard } from "@/commons/components/page/StatCard";
import type { HighlightStat } from "@/commons/constants/page-content";
import { formatUpdatedAt } from "@/commons/utils/format-updated-at";

export function PageHero({
  title,
  description,
  updatedAt,
  children,
}: {
  title: string;
  description: string;
  updatedAt?: string;
  children?: ReactNode;
}) {
  const displayedUpdatedAt = formatUpdatedAt(updatedAt);

  return (
    <section className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="max-w-3xl text-2xl font-bold tracking-[-0.02em] text-slate-900">{title}</h2>
        {displayedUpdatedAt ? (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold text-[#2454C8]">
            <Clock className="h-3.5 w-3.5" />
            마지막 업데이트 {displayedUpdatedAt}
          </div>
        ) : null}
      </div>
      <p className="mt-2 text-[15px] font-medium leading-relaxed text-slate-500">{description}</p>
      {children ? <div className="mt-5">{children}</div> : null}
    </section>
  );
}

export function StatsGrid({ stats }: { stats: HighlightStat[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
    </section>
  );
}
