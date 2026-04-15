import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";

export function SalesBottomSummaryCards() {
  return (
    <section className="grid gap-5 md:grid-cols-3">
      <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
        <div className="flex items-center gap-3">
          <DollarSign className="h-7 w-7 text-[#2454C8]" />
          <div>
            <p className="text-sm text-slate-500">오늘 매출</p>
            <p className="font-bold text-slate-900">1,850,000원</p>
          </div>
        </div>
      </article>
      <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-7 w-7 text-green-600" />
          <div>
            <p className="text-sm text-slate-500">오늘 순이익</p>
            <p className="font-bold text-green-600">+342,000원</p>
          </div>
        </div>
      </article>
      <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
        <div className="flex items-center gap-3">
          <TrendingDown className="h-7 w-7 text-red-600" />
          <div>
            <p className="text-sm text-slate-500">총 비용</p>
            <p className="font-bold text-red-600">1,508,000원</p>
          </div>
        </div>
      </article>
    </section>
  );
}
