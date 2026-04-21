import type { HQMarketInsightsResponse } from "@/features/analytics/types/analytics";

type Props = {
  data?: HQMarketInsightsResponse;
  isLoading: boolean;
};

const RISK_BADGE_CLASS: Record<"high" | "medium" | "low", string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700",
};

export function HQMarketOverviewSection({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <section className="rounded-[26px] border border-border bg-white px-6 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <div className="h-6 w-56 animate-pulse rounded bg-slate-100" />
        <div className="mt-4 space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-12 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="rounded-[26px] border border-border bg-white px-6 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <p className="text-base font-bold text-slate-900">전체 지점 상권 인사이트</p>
        <p className="mt-2 text-sm text-slate-500">지점 비교 데이터를 불러오지 못했습니다.</p>
      </section>
    );
  }

  const topRiskStores = [...data.branches]
    .sort((a, b) => {
      const rank = { high: 0, medium: 1, low: 2 };
      return rank[a.risk_level] - rank[b.risk_level];
    })
    .slice(0, 8);

  return (
    <section className="rounded-[26px] border border-border bg-white px-6 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base font-bold text-slate-900">전체 지점 상권 인사이트</p>
          <p className="mt-1 text-sm text-slate-500">{data.summary.executive_summary}</p>
        </div>
        <span className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-500">
          {data.summary.source === "ai" ? "AI 인사이트" : "기본 분석"}
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold tracking-[0.04em] text-slate-500">
            <tr>
              <th className="px-3 py-2">지점</th>
              <th className="px-3 py-2">성장/흐름</th>
              <th className="px-3 py-2">리스크</th>
              <th className="px-3 py-2">요약</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {topRiskStores.map((item) => (
              <tr key={item.store_id} className="bg-white">
                <td className="px-3 py-2 font-semibold text-slate-800">{item.store_name}</td>
                <td className="px-3 py-2 text-slate-700">{item.growth_rate}</td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${RISK_BADGE_CLASS[item.risk_level]}`}
                  >
                    {item.risk_level.toUpperCase()}
                  </span>
                </td>
                <td className="px-3 py-2 text-slate-600">{item.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
