import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";

import { PageHero } from "@/components/common/page/page-layout";
import { fetchAnalyticsMetrics, fetchAuditLogs } from "@/features/analytics/api";
import type { AnalyticsMetric } from "@/features/analytics/type/analytics";

type QueryCategory = "전체" | "FAQ" | "데이터 조회" | "분석" | "민감정보";

const QUERY_TYPE_LABEL: Record<string, QueryCategory> = {
  faq: "FAQ",
  data_lookup: "데이터 조회",
  analysis: "분석",
  sensitive_request: "민감정보",
};

const ROUTE_LABEL: Record<string, string> = {
  stub_repository: "SQL/API",
  ai_proxy: "AI",
  policy_block: "차단",
};

const ROUTE_STYLE: Record<string, string> = {
  stub_repository: "bg-[#eef4ff] text-[#2454C8]",
  ai_proxy: "bg-orange-50 text-orange-600",
  policy_block: "bg-red-50 text-red-600",
};

const trendIcon = (trend: AnalyticsMetric["trend"]) => {
  if (trend === "up") return <TrendingUp className="h-3.5 w-3.5" />;
  if (trend === "down") return <TrendingDown className="h-3.5 w-3.5" />;
  return <Minus className="h-3.5 w-3.5" />;
};

const trendColor = (trend: AnalyticsMetric["trend"]) => {
  if (trend === "up") return "text-green-600 bg-green-50";
  if (trend === "down") return "text-red-600 bg-red-50";
  return "text-slate-500 bg-slate-50";
};

export function AnalyticsPage() {
  const [activeCategory, setActiveCategory] = useState<QueryCategory>("전체");
  const categories: QueryCategory[] = ["전체", "FAQ", "데이터 조회", "분석", "민감정보"];

  const metricsQuery = useQuery({
    queryKey: ["analytics-metrics"],
    queryFn: fetchAnalyticsMetrics,
    refetchInterval: 15_000,
  });

  const metrics = metricsQuery.data?.items ?? [];

  const logsQuery = useQuery({
    queryKey: ["audit-logs-sales"],
    queryFn: () => fetchAuditLogs("sales", 20),
    refetchInterval: 15_000,
  });

  const allLogs = logsQuery.data?.items ?? [];
  const filteredLogs = activeCategory === "전체"
    ? allLogs
    : allLogs.filter((l) => {
        const meta = l.metadata as Record<string, unknown>;
        const qt = typeof meta?.query_type === "string" ? QUERY_TYPE_LABEL[meta.query_type] : null;
        return qt === activeCategory;
      });

  const sqlCount = allLogs.filter((l) => l.route === "stub_repository").length;
  const sqlPct = allLogs.length > 0 ? Math.round(sqlCount / allLogs.length * 100) : 0;
  const blockedCount = allLogs.filter((l) => l.route === "policy_block").length;

  return (
    <div className="space-y-6">
      <PageHero
        title="매출 데이터를 한눈에 파악합니다."
        description={`주요 지표 ${metrics.length}개와 질의 처리 로그 ${allLogs.length}건을 확인합니다.`}
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
            <p className="text-xs text-slate-400 mt-0.5">매출 도메인 · SQL/API 우선 처리율 {sqlPct}% · 차단 {blockedCount}건</p>
          </div>
          <div className="flex flex-wrap gap-2">
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
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">유형</th>
              </tr>
            </thead>
            <tbody>
              {logsQuery.isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-400">로그를 불러오는 중입니다...</td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-400">아직 기록된 로그가 없어요.</td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const meta = log.metadata as Record<string, unknown>;
                  const queryText = typeof meta?.prompt === "string" ? meta.prompt : log.message;
                  const queryType = typeof meta?.query_type === "string" ? QUERY_TYPE_LABEL[meta.query_type] : null;
                  return (
                    <tr key={log.id} className="border-b border-border/30 last:border-0 hover:bg-[#f8fbff]">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{log.timestamp.slice(11, 19)}</td>
                      <td className="px-4 py-4 font-medium text-slate-800 max-w-[260px] truncate">{queryText}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${ROUTE_STYLE[log.route] ?? "bg-slate-100 text-slate-600"}`}>
                          {ROUTE_LABEL[log.route] ?? log.route}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {queryType ? (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{queryType}</span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border/40 px-6 py-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>매출 도메인 총 {allLogs.length}건 처리 · SQL/API 우선 처리율 {sqlPct}%</span>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-3.5 w-3.5" />
              감사 로그 기준
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
