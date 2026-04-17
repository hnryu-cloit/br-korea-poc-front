import type { SalesSummaryResponse } from "@/features/sales/types/sales";

const formatWonShort = (value: number) => `${Math.round(value / 10000).toLocaleString()}만`;

export const SalesV2ChartsSection = ({
  summary,
  isLoading,
}: {
  summary?: SalesSummaryResponse;
  isLoading: boolean;
}) => {
  const weekly = summary?.weekly_data ?? [];
  const maxRevenue = Math.max(...weekly.map((item) => item.revenue), 1);

  const topProducts = summary?.top_products?.slice(0, 5) ?? [];
  const maxProductSales = Math.max(...topProducts.map((item) => item.sales), 1);

  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <article className="rounded-[28px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <div className="mb-4">
          <p className="text-sm font-bold text-slate-800">주간 매출/순매출 추이</p>
          <p className="mt-1 text-xs text-slate-400">점포 일자별 실매출 기준</p>
        </div>
        {isLoading ? (
          <p className="text-sm text-slate-400">차트 데이터를 불러오는 중...</p>
        ) : weekly.length === 0 ? (
          <p className="text-sm text-slate-400">표시할 주간 데이터가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-7 items-end gap-2">
            {weekly.map((item) => {
              const revenueHeight = Math.max(12, Math.round((item.revenue / maxRevenue) * 120));
              const netHeight = Math.max(10, Math.round((item.net_revenue / maxRevenue) * 120));
              return (
                <div key={item.day} className="space-y-2">
                  <div className="flex h-[128px] items-end justify-center gap-1 rounded-xl bg-[#f8fbff] px-1 py-2">
                    <div
                      className="w-3 rounded bg-[#bfd5ff]"
                      style={{ height: `${revenueHeight}px` }}
                      title={`매출 ${item.revenue.toLocaleString()}원`}
                    />
                    <div
                      className="w-3 rounded bg-[#2d6bff]"
                      style={{ height: `${netHeight}px` }}
                      title={`순매출 ${item.net_revenue.toLocaleString()}원`}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] font-semibold text-slate-500">{item.day}</p>
                    <p className="text-[10px] text-slate-400">{formatWonShort(item.net_revenue)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </article>

      <article className="rounded-[28px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <div className="mb-4">
          <p className="text-sm font-bold text-slate-800">상위 상품 매출 차트</p>
          <p className="mt-1 text-xs text-slate-400">최근 집계 기준 Top 5</p>
        </div>
        {isLoading ? (
          <p className="text-sm text-slate-400">차트 데이터를 불러오는 중...</p>
        ) : topProducts.length === 0 ? (
          <p className="text-sm text-slate-400">표시할 상품 데이터가 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {topProducts.map((item) => {
              const widthPct = Math.max(8, Math.round((item.sales / maxProductSales) * 100));
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-slate-700">{item.name}</p>
                    <p className="text-xs font-semibold text-slate-500">{item.sales.toLocaleString()}원</p>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-[#2454C8]" style={{ width: `${widthPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </article>
    </section>
  );
};
