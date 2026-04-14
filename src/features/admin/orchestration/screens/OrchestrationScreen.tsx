import { useQuery } from "@tanstack/react-query";
import { Shield, CheckCircle, AlertTriangle } from "lucide-react";

import { orchestrationStats } from "@/commons/constants/page-content";
import { PageHero, StatsGrid } from "@/commons/components/page/page-layout";
import { getAuditLogs } from "@/features/analytics/api/analytics";
import type { AuditLogEntry } from "@/features/analytics/types/analytics";

const ROUTE_COLOR: Record<string, string> = {
  stub_repository: "bg-[#eef4ff] text-[#2454C8]",
  ai_proxy: "bg-orange-50 text-orange-600",
  policy_block: "bg-red-50 text-red-600",
};

const ROUTE_LABEL: Record<string, string> = {
  stub_repository: "SQL/API",
  ai_proxy: "AI",
  policy_block: "차단",
};

const QUERY_TYPE_COLOR: Record<string, string> = {
  faq: "bg-slate-100 text-slate-600",
  data_lookup: "bg-[#eef4ff] text-[#2454C8]",
  analysis: "bg-orange-50 text-orange-600",
  sensitive_request: "bg-red-50 text-red-600",
};

const QUERY_TYPE_LABEL: Record<string, string> = {
  faq: "FAQ",
  data_lookup: "데이터 조회",
  analysis: "분석",
  sensitive_request: "민감정보",
};

const policyItems = [
  { label: "민감정보 마스킹", description: "매출, 손익, 생산량 원본 → 집계값 또는 차단" },
  { label: "역할 기반 접근 제어", description: "점주 / 운영 / 본사 조회 범위 분리 적용" },
  { label: "감사 로그 수집", description: "프롬프트, 응답, 라우팅 경로 감사 가능 저장" },
  { label: "RAG 출처 응답", description: "환각 위험 시 조회형 응답으로 다운그레이드" },
  { label: "LLM 호출 최소화", description: "정형 조회는 SQL/API 우선 처리, 토큰 추적" },
  { label: "퍼블릭 LLM 직접 전송 제한", description: "민감정보 마스킹 후 요약 컨텍스트만 전달" },
];

function getQueryFromMetadata(entry: AuditLogEntry): string {
  const meta = entry.metadata as Record<string, unknown>;
  if (typeof meta?.prompt === "string") return meta.prompt;
  return entry.message;
}

export function OrchestrationPage() {
  const logsQuery = useQuery({
    queryKey: ["audit-logs"],
    queryFn: () => getAuditLogs(undefined, 50),
    refetchInterval: 10_000,
  });

  const logs = logsQuery.data?.items ?? [];
  const isBlocked = (entry: AuditLogEntry) => entry.route === "policy_block" || entry.outcome === "blocked";
  const sqlPct = logs.length > 0
    ? Math.round(logs.filter((l) => l.route === "stub_repository").length / logs.length * 100)
    : 0;
  const blockedCount = logs.filter(isBlocked).length;

  return (
    <div className="space-y-6">
      <PageHero
        title="보안 정책과 AI 처리 현황을 점검합니다."
        description="질의 라우팅, 민감정보 마스킹, 감사 로그 수집 상태를 한 화면에서 확인합니다."
      />
      <StatsGrid stats={orchestrationStats} />

      {/* Summary metrics */}
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "SQL/API 우선 처리율", value: `${sqlPct}%`, desc: `${logs.length}건 중 ${logs.filter((l) => l.route === "stub_repository").length}건`, tone: "success" },
          { label: "민감정보 차단 건수", value: `${blockedCount}건`, desc: "전체 기준", tone: "danger" },
          { label: "총 처리 건수", value: `${logs.length}건`, desc: "감사 로그 기준", tone: "primary" },
        ].map((item) => (
          <article key={item.label} className="rounded-[26px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
            <p className={`mt-3 text-2xl font-bold ${item.tone === "success" ? "text-green-600" : item.tone === "danger" ? "text-red-600" : "text-[#2454C8]"}`}>{item.value}</p>
            <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
          </article>
        ))}
      </section>

      {/* Audit log */}
      <section className="rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)] overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
          <div>
            <p className="text-base font-semibold text-slate-900">감사 로그</p>
            <p className="text-xs text-slate-400 mt-0.5">전체 질의 기록 · 감사 가능 저장 완료</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600">
            <CheckCircle className="h-3.5 w-3.5" />
            수집 중
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-[#f8fbff]">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">시각</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">질의 / 이벤트</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">유형</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">처리 경로</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">마스킹</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">역할</th>
              </tr>
            </thead>
            <tbody>
              {logsQuery.isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">로그를 불러오는 중입니다...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">아직 기록된 로그가 없어요.</td>
                </tr>
              ) : (
                logs.map((log) => {
                  const blocked = isBlocked(log);
                  const meta = log.metadata as Record<string, unknown>;
                  const queryType = typeof meta?.query_type === "string" ? meta.query_type : null;
                  const maskedFields = Array.isArray(meta?.masked_fields) ? meta.masked_fields as string[] : [];
                  return (
                    <tr key={log.id} className={`border-b border-border/30 last:border-0 ${blocked ? "bg-red-50/30" : "hover:bg-[#f8fbff]"}`}>
                      <td className="px-5 py-3.5 text-xs font-mono text-slate-500">
                        {log.timestamp.slice(11, 19)}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-800 max-w-[220px] truncate">
                        {getQueryFromMetadata(log)}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {queryType ? (
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${QUERY_TYPE_COLOR[queryType] ?? "bg-slate-100 text-slate-600"}`}>
                            {QUERY_TYPE_LABEL[queryType] ?? queryType}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-300">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${ROUTE_COLOR[log.route] ?? "bg-slate-100 text-slate-600"}`}>
                          {ROUTE_LABEL[log.route] ?? log.route}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {maskedFields.length > 0 ? (
                          <span className="flex items-center justify-center gap-1 text-xs font-medium text-orange-500">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            적용
                          </span>
                        ) : (
                          <span className="text-xs text-slate-300">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500">{log.actor_role}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Security policy status */}
      <section className="rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <div className="flex items-center gap-3 mb-5">
          <Shield className="h-5 w-5 text-primary" />
          <p className="text-base font-semibold text-slate-900">보안 정책 현황</p>
          <span className="ml-auto rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">전체 적용 중</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {policyItems.map((item) => (
            <div key={item.label} className="flex items-start gap-3 rounded-2xl bg-[#f8fbff] px-4 py-3">
              <CheckCircle className="h-4 w-4 shrink-0 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
