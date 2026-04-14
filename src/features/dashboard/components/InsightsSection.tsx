import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";


const quickLinks = [
  { label: "생산 관리", path: "/production" },
  { label: "주문 관리", path: "/ordering" },
  { label: "손익 분석", path: "/sales" },
];

export function InsightsSection({
  insights,
}: {
  insights: string[];
}) {
  return (
    <section className="grid gap-5 xl:grid-cols-2">
      <article className="rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <p className="text-lg font-bold text-slate-900">오늘의 주요 인사이트</p>
        <div className="mt-4 space-y-3">
          {insights.map((item, index) => (
            <div key={index} className="flex items-center gap-3 rounded-2xl bg-[#f8fbff] px-4 py-3 text-sm text-slate-600">
              <Zap className="mt-0.5 h-4 w-4 shrink-0 text-[#2454C8]" />
                <p className="mt-1">{item}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <p className="text-lg font-bold text-slate-900">빠른 실행 가이드</p>
        <div className="mt-4 space-y-3">
          {quickLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-4 py-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-[#eef4ff] hover:text-[#2454C8]"
            >
              {item.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </article>
    </section>
  );
}
