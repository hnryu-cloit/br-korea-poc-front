import type { AnalyticsMetric } from "@/features/analytics/types/analytics";
import dayjs from "dayjs";

export const AnalyticsMetricsGrid = ({
  metrics,
  dateFrom,
  dateTo,
}: {
  metrics: AnalyticsMetric[];
  dateFrom: string;
  dateTo: string;
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
        <article
          key={metric.label}
          className="rounded-[6px] border border-[#DADADA] bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)] flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3A3A3C]">
              {metric.label}
            </p>
            <p className="text-xs text-[#8E8E93]">
              ({dayjs(new Date(dateFrom)).format("YYYY년 MM월 DD일")} ~{" "}
              {dayjs(new Date(dateTo)).format("YYYY년 MM월 DD일")})
            </p>
          </div>
          <p className="text-2xl text-brown-700">{metric.value}</p>
          <p className="border border-[#FF6467] text-[#FF6467] text-sm font-bold w-fit px-2 py-1 rounded-[24px]">
            {metric.change}
          </p>
        </article>
      ))}
    </section>
  );
};
