import { Zap } from "lucide-react";

export function InsightsSection({
  insights,
}: {
  insights: string[];
}) {
  return (
    <section className="">
      <article className="rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <p className="text-lg font-bold text-slate-900">오늘의 주요 인사이트</p>
        <div className="mt-4 grid grid-cols-3 gap-3.5">
          {insights.map((item, index) => (
            <div key={index} className="flex items-center gap-3 rounded-2xl bg-[#f8fbff] px-4 py-3 text-sm text-slate-600 m-0">
              <Zap className="mt-0.5 h-4 w-4 shrink-0 text-[#2454C8]" />
                <p className="mt-1">{item}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
