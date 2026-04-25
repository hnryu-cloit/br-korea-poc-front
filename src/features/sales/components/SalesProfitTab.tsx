import { InfoPopover } from "@/commons/components/info/InfoPopover";
import { FIELD_CAPTIONS } from "@/commons/constants/field-captions";
import type { SalesWeeklyDataItem } from "@/features/sales/types/sales-screen";

export function SalesProfitTab({ weeklyData }: { weeklyData: SalesWeeklyDataItem[] }) {
  const totalRevenue = weeklyData.reduce((acc, d) => acc + d.revenue, 0);
  const totalNetRevenue = weeklyData.reduce((acc, d) => acc + d.net_revenue, 0);
  const avgNetRevenue = weeklyData.length > 0 ? Math.round(totalNetRevenue / weeklyData.length) : 0;

  return (
    <div className="space-y-5">
      <article className="rounded-[24px] border border-border bg-[#f8fbff] px-5 py-5">
        <span className="inline-flex items-center gap-1.5">
          <p className="text-lg font-bold text-slate-900">주간 매출 및 순매출 추이</p>
          <InfoPopover
            caption={FIELD_CAPTIONS["sales:weekly_revenue_trend"]}
            side="bottom"
            align="left"
          />
        </span>
        <div className="mt-4 grid gap-3 lg:grid-cols-7">
          {weeklyData.map((day) => (
            <div key={day.day} className="rounded-2xl bg-white px-4 py-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-400">{day.day}</p>
              <p className="mt-2 text-sm font-bold text-slate-800">
                매출 {Math.round(day.revenue / 10000)}만
              </p>
              <p className="mt-1 text-sm font-bold text-green-600">
                순매출 {Math.round(day.net_revenue / 10000)}만
              </p>
              <p className="mt-1 text-xs text-slate-500">
                할인 {Math.round((day.revenue - day.net_revenue) / 1000)}천
              </p>
            </div>
          ))}
        </div>
      </article>
      <div className="grid gap-5 md:grid-cols-2">
        <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-sm">
          <span className="inline-flex items-center gap-1.5">
            <p className="text-base font-bold text-slate-900">주간 누적 순매출</p>
            <InfoPopover
              caption={FIELD_CAPTIONS["sales:weekly_net_revenue"]}
              side="bottom"
              align="left"
            />
          </span>
          <p className="mt-3 text-3xl font-bold text-green-600">
            {totalNetRevenue.toLocaleString()}원
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {weeklyData.length}일 누적 · 평균 일 순매출 {avgNetRevenue.toLocaleString()}원
          </p>
        </article>
        <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-sm">
          <span className="inline-flex items-center gap-1.5">
            <p className="text-base font-bold text-slate-900">주간 총 매출</p>
            <InfoPopover
              caption={FIELD_CAPTIONS["sales:weekly_total_revenue"]}
              side="bottom"
              align="left"
            />
          </span>
          <p className="mt-3 text-3xl font-bold text-[#2454C8]">
            {totalRevenue.toLocaleString()}원
          </p>
          <p className="mt-2 text-sm text-slate-500">할인 차감 전 총 매출 기준 · 실 DB 데이터</p>
        </article>
      </div>
    </div>
  );
}
