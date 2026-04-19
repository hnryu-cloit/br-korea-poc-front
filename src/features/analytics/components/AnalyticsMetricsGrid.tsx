import { Minus, TrendingDown, TrendingUp } from "lucide-react";

import type { AnalyticsMetric } from "@/features/analytics/types/analytics";

const trendIcon = (trend: AnalyticsMetric["trend"]) => {
  if (trend === "up") return <TrendingUp className="h-3.5 w-3.5" />;
  if (trend === "down") return <TrendingDown className="h-3.5 w-3.5" />;
  return <Minus className="h-3.5 w-3.5" />;
};

const trendColor = (trend: AnalyticsMetric["trend"]) => {
  if (trend === "up") return "text-green-600 bg-green-50";
  if (trend === "down") return "text-red-600 bg-red-50";
  return "text-slate-500 bg-slate-50";
};

export const AnalyticsMetricsGrid = ({
  metrics,
}: {
  metrics: AnalyticsMetric[];
}) => {
  if (metrics.length === 0) {
    return (
      <section className="flex items-center justify-center rounded-[26px] border border-border bg-white px-5 py-16 text-sm text-slate-400 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        표시할 지표 데이터가 없습니다.
      </section>
    );
  }

  return (
  <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {metrics.map((metric) => (
      <article key={metric.label} className="rounded-[26px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{metric.label}</p>
        <p className="mt-3 text-2xl font-bold text-slate-900">{metric.value}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${trendColor(metric.trend)}`}>
            {trendIcon(metric.trend)}
            {metric.change}
          </span>
          <span className="text-xs text-slate-400">{metric.detail}</span>
        </div>
      </article>
    ))}
  </section>
  );
};
