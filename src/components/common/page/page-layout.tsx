import type { ReactNode } from "react";

import { StatCard } from "@/components/common/page/StatCard";
import type { HighlightStat } from "@/commons/constants/page-content";

export function PageHero({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[32px] border border-[#dbe6fb] bg-[linear-gradient(135deg,#ffffff_0%,#edf4ff_48%,#f8fbff_100%)] px-6 py-7 shadow-[0_20px_50px_rgba(31,77,187,0.08)]">
      <h2 className="max-w-3xl text-2xl font-bold tracking-[-0.02em] text-slate-900">{title}</h2>
      <p className="mt-2 max-w-2xl text-[15px] font-medium leading-relaxed text-slate-500">{description}</p>
      {children ? <div className="mt-5">{children}</div> : null}
    </section>
  );
}

export function StatsGrid({ stats }: { stats: HighlightStat[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </section>
  );
}
