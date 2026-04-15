import { Target } from "lucide-react";

import { formatWon } from "@/features/sales/utils/format";

export function SalesBreakEvenSection({
  breakEvenPoint,
  todayProfit,
  todayRevenue,
  targetProfit,
  itemsNeeded,
}: {
  breakEvenPoint: number;
  todayProfit: number;
  todayRevenue: number;
  targetProfit: number;
  itemsNeeded: number;
}) {
  return (
    <section className="rounded-[28px] border border-[#dbe6fb] bg-[#edf4ff] px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="flex items-start gap-3">
        <Target className="mt-0.5 h-5 w-5 shrink-0 text-[#2454C8]" />
        <div>
          <p className="text-lg font-bold text-[#2454C8]">손익분기점 분석</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            오늘 손익분기점 {formatWon(breakEvenPoint)}을 달성했습니다. 현재 순이익은 {formatWon(todayProfit)}이며 손익분기점 대비 {formatWon(todayRevenue - breakEvenPoint)} 초과 달성했습니다.
          </p>
          <div className="mt-4 rounded-2xl bg-white px-4 py-4">
            <p className="text-sm font-bold text-slate-900">목표 순이익 달성 계획</p>
            <p className="mt-1 text-sm text-slate-600">
              하루 목표 순이익 {formatWon(targetProfit)}에 도달하려면 도넛 {itemsNeeded}개를 더 판매하면 됩니다. (평균 개당 순이익 6,800원 기준)
            </p>
          </div>
          <p className="mt-3 text-xs text-slate-500">계산 기준: 2026-04-06 강남점 평균 순이익률 및 품목별 원가 반영</p>
        </div>
      </div>
    </section>
  );
}
