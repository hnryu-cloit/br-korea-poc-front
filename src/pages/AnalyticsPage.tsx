import { useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";

import { PageHero } from "@/pages/shared";

type Metric = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "flat";
  detail: string;
};

const metrics: Metric[] = [
  { label: "이번 주 총 매출", value: "₩4,382,000", change: "+6.2%", trend: "up", detail: "지난주 대비" },
  { label: "배달 건수", value: "312건", change: "-14.3%", trend: "down", detail: "지난주 대비" },
  { label: "홀 방문 고객", value: "487명", change: "+3.1%", trend: "up", detail: "지난주 대비" },
  { label: "앱 주문 비중", value: "28%", change: "+0%", trend: "flat", detail: "지난주 대비" },
  { label: "커피 동반 구매율", value: "62%", change: "+8.4%", trend: "up", detail: "지난주 대비" },
  { label: "평균 객단가", value: "₩8,940", change: "+2.7%", trend: "up", detail: "지난주 대비" },
];

type QueryCategory = "전체" | "매출" | "배달" | "상품" | "고객";

const queryLogs = [
  { id: 1, time: "14:02", query: "이번 주 배달 감소 원인", route: "SQL", tokens: 0, category: "배달" },
  { id: 2, time: "13:48", query: "T-day 이후 재방문율 변화", route: "SQL+RAG", tokens: 312, category: "고객" },
  { id: 3, time: "13:21", query: "오전 채널별 매출 비교", route: "SQL", tokens: 0, category: "매출" },
  { id: 4, time: "12:55", query: "커피 세트 전환율 분석", route: "SQL+LLM", tokens: 428, category: "상품" },
  { id: 5, time: "11:30", query: "전년 동월 대비 차이", route: "SQL", tokens: 0, category: "매출" },
];

const trendIcon = (trend: Metric["trend"]) => {
  if (trend === "up") return <TrendingUp className="h-3.5 w-3.5" />;
  if (trend === "down") return <TrendingDown className="h-3.5 w-3.5" />;
  return <Minus className="h-3.5 w-3.5" />;
};

const trendColor = (trend: Metric["trend"]) => {
  if (trend === "up") return "text-green-600 bg-green-50";
  if (trend === "down") return "text-red-600 bg-red-50";
  return "text-slate-500 bg-slate-50";
};

export function AnalyticsPage() {
  const [activeCategory, setActiveCategory] = useState<QueryCategory>("전체");
  const categories: QueryCategory[] = ["전체", "매출", "배달", "상품", "고객"];
  const filteredLogs = activeCategory === "전체" ? queryLogs : queryLogs.filter((l) => l.category === activeCategory);

  return (
    <div className="space-y-6">
      <PageHero
        title="매출 데이터를 한눈에 파악합니다."
        description="주요 지표 변화와 질의 처리 이력을 확인합니다."
      />

      {/* Metric grid */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((m) => (
          <article key={m.label} className="rounded-[26px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{m.label}</p>
            <p className="mt-3 text-2xl font-bold text-slate-900">{m.value}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${trendColor(m.trend)}`}>
                {trendIcon(m.trend)}
                {m.change}
              </span>
              <span className="text-xs text-slate-400">{m.detail}</span>
            </div>
          </article>
        ))}
      </section>

      {/* Query log */}
      <section className="rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)] overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-6 py-5">
          <div>
            <p className="text-base font-semibold text-slate-900">질의 처리 로그</p>
            <p className="text-xs text-slate-400 mt-0.5">오늘 · SQL/API 우선 처리 적용</p>
          </div>
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeCategory === cat ? "bg-[#2454C8] text-white" : "border border-[#dce4f3] bg-[#f7faff] text-slate-600 hover:bg-[#eef4ff]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-[#f8fbff]">
                <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">시각</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">질의</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">처리 경로</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">LLM 토큰</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">분류</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-border/30 last:border-0 hover:bg-[#f8fbff]">
                  <td className="px-6 py-4 text-slate-500">{log.time}</td>
                  <td className="px-4 py-4 font-medium text-slate-800">{log.query}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                      log.route === "SQL" ? "bg-[#eef4ff] text-[#2454C8]" : log.route === "SQL+LLM" ? "bg-orange-50 text-orange-600" : "bg-purple-50 text-purple-600"
                    }`}>
                      {log.route}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {log.tokens > 0 ? (
                      <span className="text-sm font-medium text-slate-700">{log.tokens.toLocaleString()}</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{log.category}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border/40 px-6 py-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>오늘 총 {queryLogs.length}건 처리 · SQL/API 우선 처리율 60%</span>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-3.5 w-3.5" />
              평균 LLM 토큰 148개 / 질의
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
