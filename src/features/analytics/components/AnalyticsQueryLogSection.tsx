import { BarChart3 } from "lucide-react";

import { formatCountWithUnit } from "@/commons/utils/format-count";
import {
  ANALYTICS_CATEGORIES,
  ROUTE_LABEL,
  ROUTE_STYLE,
} from "@/features/analytics/constants/analytics-screen";
import {
  getLogPromptText,
  getLogQueryLabel,
} from "@/features/analytics/utils/analytics-screen";
import type { AuditLogEntry } from "@/features/analytics/types/analytics";
import type { QueryCategory } from "@/features/analytics/types/analytics-screen";

export const AnalyticsQueryLogSection = ({
  activeCategory,
  onChangeCategory,
  logs,
  allLogsCount,
  sqlPct,
  blockedCount,
  isLoading,
}: {
  activeCategory: QueryCategory;
  onChangeCategory: (category: QueryCategory) => void;
  logs: AuditLogEntry[];
  allLogsCount: number;
  sqlPct: number;
  blockedCount: number;
  isLoading: boolean;
}) => (
  <section className="overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-6 py-5">
      <div>
        <p className="text-base font-semibold text-slate-900">질의 처리 로그</p>
        <p className="mt-0.5 text-xs text-slate-400">매출 도메인 · SQL/API 우선 처리율 {sqlPct}% · 차단 {formatCountWithUnit(blockedCount, "건")}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {ANALYTICS_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onChangeCategory(category)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeCategory === category ? "bg-[#2454C8] text-white" : "border border-[#dce4f3] bg-[#f7faff] text-slate-600 hover:bg-[#eef4ff]"
            }`}
          >
            {category}
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
          {isLoading ? (
            <tr>
              <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-400">로그를 불러오는 중입니다...</td>
            </tr>
          ) : logs.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-400">아직 기록된 로그가 없어요.</td>
            </tr>
          ) : (
            logs.map((log) => {
              const queryText = getLogPromptText(log);
              const queryType = getLogQueryLabel(log);
              return (
                <tr key={log.id} className="border-b border-border/30 last:border-0 hover:bg-[#f8fbff]">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{log.timestamp.slice(11, 19)}</td>
                  <td className="max-w-[260px] truncate px-4 py-4 font-medium text-slate-800">{queryText}</td>
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
        <span>매출 도메인 총 {formatCountWithUnit(allLogsCount, "건")} 처리 · SQL/API 우선 처리율 {sqlPct}%</span>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-3.5 w-3.5" />
          감사 로그 기준
        </div>
      </div>
    </div>
  </section>
);
