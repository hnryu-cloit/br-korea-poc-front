import type { SalesWeeklyDataItem } from "@/features/sales/types/sales-screen";

export function SalesProfitTab({
  weeklyData,
}: {
  weeklyData: SalesWeeklyDataItem[];
}) {
  return (
    <div className="space-y-5">
      <article className="rounded-[24px] border border-border bg-[#f8fbff] px-5 py-5">
        <p className="text-lg font-bold text-slate-900">주간 매출 및 순이익 추이</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-7">
          {weeklyData.map((day) => (
            <div key={day.day} className="rounded-2xl bg-white px-4 py-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-400">{day.day}</p>
              <p className="mt-2 text-sm font-bold text-slate-800">매출 {Math.round(day.revenue / 10000)}만</p>
              <p className="mt-1 text-sm font-bold text-green-600">순이익 {Math.round(day.profit / 1000)}천</p>
              <p className="mt-1 text-xs text-slate-500">비용 {Math.round(day.cost / 10000)}만</p>
            </div>
          ))}
        </div>
      </article>
      <div className="grid gap-5 md:grid-cols-2">
        <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-sm">
          <p className="text-base font-bold text-slate-900">주간 누적 순이익</p>
          <p className="mt-3 text-3xl font-bold text-green-600">+3,902,000원</p>
          <p className="mt-2 text-sm text-slate-500">7일 누적 순이익 · 평균 일 순이익 557,000원</p>
        </article>
        <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-sm">
          <p className="text-base font-bold text-slate-900">손익분기점 달성 현황</p>
          <p className="mt-3 text-3xl font-bold text-[#2454C8]">7/7일</p>
          <p className="mt-2 text-sm text-slate-500">이번 주 모든 영업일에 손익분기점을 달성했습니다.</p>
        </article>
      </div>
    </div>
  );
}
