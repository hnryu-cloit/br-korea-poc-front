import { Calendar, CloudRain, TrendingUp } from "lucide-react";

export function OrderingContextCards() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
        <div className="flex items-center gap-3">
          <Calendar className="h-7 w-7 text-[#2454C8]" />
          <div>
            <p className="text-sm text-slate-500">오늘</p>
            <p className="font-bold text-slate-900">2026년 4월 6일 월요일</p>
          </div>
        </div>
      </article>
      <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
        <div className="flex items-center gap-3">
          <CloudRain className="h-7 w-7 text-slate-500" />
          <div>
            <p className="text-sm text-slate-500">날씨 예보</p>
            <p className="font-bold text-slate-900">맑음, 22°C</p>
          </div>
        </div>
      </article>
      <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-7 w-7 text-green-600" />
          <div>
            <p className="text-sm text-slate-500">최근 트렌드</p>
            <p className="font-bold text-green-600">+12% 증가세</p>
          </div>
        </div>
      </article>
    </section>
  );
}
