import { Target } from "lucide-react";

import { formatWon } from "@/features/sales/utils/format";

export function SalesBreakEvenSection({
  todayRevenue,
  estimatedTodayProfit,
  avgMarginRate,
  avgNetProfitPerItem,
}: {
  todayRevenue: number;
  estimatedTodayProfit: number;
  avgMarginRate: number;
  avgNetProfitPerItem: number;
}) {
  const marginPct = Math.round(avgMarginRate * 100 * 10) / 10;

  return (
    <section className="rounded-[28px] border border-[#dbe6fb] bg-[#edf4ff] px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="flex items-start gap-3">
        <Target className="mt-0.5 h-5 w-5 shrink-0 text-[#2454C8]" />
        <div className="w-full">
          <p className="text-lg font-bold text-[#2454C8]">수익성 분석</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            오늘 매출 {formatWon(todayRevenue)} 기준, 상품 원가 데이터로 추정한 매출이익은{" "}
            <span className="font-semibold text-slate-900">{formatWon(estimatedTodayProfit)}</span>
            입니다.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white px-4 py-3">
              <p className="text-xs text-slate-500">평균 마진율</p>
              <p className="mt-1 text-base font-bold text-slate-900">{marginPct}%</p>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3">
              <p className="text-xs text-slate-500">추정 매출이익</p>
              <p className="mt-1 text-base font-bold text-slate-900">{formatWon(estimatedTodayProfit)}</p>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3">
              <p className="text-xs text-slate-500">평균 개당 순이익</p>
              <p className="mt-1 text-base font-bold text-slate-900">{formatWon(avgNetProfitPerItem)}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">생산 데이터 원가 기록 기준 추정값 · 고정비 미반영</p>
        </div>
      </div>
    </section>
  );
}