import { Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useState } from "react";

import { PageHero } from "@/commons/components/page/page-layout";
import { formatCountWithUnit } from "@/commons/utils/format-count";
import {
  PROCESSING_ROUTE,
  ROUTE_LABEL,
  ROUTE_STYLE as ROUTE_COLOR,
  QUERY_TYPE_LABEL,
  QUERY_TYPE_STYLE as QUERY_TYPE_COLOR,
} from "@/commons/constants/audit-route";
import type { AuditLogEntry } from "@/features/analytics/types/analytics";
import { useOrchestrationScreen } from "@/features/admin/orchestration/hooks/useOrchestrationScreen";
import type { PromptDomainKey } from "@/features/admin/orchestration/types/orchestration";
import { SettingsSubNav } from "@/features/settings/components/SettingsSubNav";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";

const policyItems = [
  { label: "민감정보 마스킹", description: "매출, 손익, 생산량 원본 → 집계값 또는 차단" },
  { label: "역할 기반 접근 제어", description: "점주 / 운영 / 본사 조회 범위 분리 적용" },
  { label: "감사 로그 수집", description: "프롬프트, 응답, 라우팅 경로 감사 가능 저장" },
  { label: "RAG 출처 응답", description: "환각 위험 시 조회형 응답으로 다운그레이드" },
  { label: "LLM 호출 최소화", description: "정형 조회는 SQL/API 우선 처리, 토큰 추적" },
  { label: "퍼블릭 LLM 직접 전송 제한", description: "민감정보 마스킹 후 요약 컨텍스트만 전달" },
];

const DOMAIN_KEYS: PromptDomainKey[] = ["production", "ordering", "sales"];

const DOMAIN_LABEL: Record<PromptDomainKey, string> = {
  production: "생산관리",
  ordering: "주문관리",
  sales: "손익분석",
};

type TwinTab = "prompt" | "data" | "logs" | "security";

const TWIN_TABS: { key: TwinTab; label: string; description: string }[] = [
  { key: "prompt", label: "프롬프트 설정", description: "도메인별 AI 지시문/빠른질문 관리" },
  { key: "data", label: "데이터 설정", description: "데이터 처리·라우팅 지표 확인" },
  { key: "logs", label: "로그 관리", description: "감사 로그 조회 및 추적" },
  { key: "security", label: "보안 정책", description: "민감정보/권한 정책 상태 점검" },
];

function getQueryFromMetadata(entry: AuditLogEntry): string {
  const meta = entry.metadata as Record<string, unknown>;
  if (typeof meta?.prompt === "string") return meta.prompt;
  return entry.message;
}

export function OrchestrationScreen() {
  const location = useLocation();
  const isSettingsRoute = location.pathname.startsWith("/settings");
  const [activeTab, setActiveTab] = useState<TwinTab>(isSettingsRoute ? "prompt" : "logs");
  const { user } = useDemoSession();
  const {
    logsQuery,
    promptSettingsQuery,
    saveMutation,
    form,
    saveMessage,
    logs,
    sqlPct,
    blockedCount,
    updatedAtText,
    isBlocked,
    handleDomainChange,
    handleSavePromptSettings,
  } = useOrchestrationScreen();

  return (
    <div className="space-y-6">
      <PageHero
        title={
          isSettingsRoute
            ? "Digital Twin 설정을 관리합니다."
            : "보안 정책과 AI 처리 현황을 점검합니다."
        }
        description={
          isSettingsRoute
            ? "도메인별 시스템 프롬프트와 빠른 질문을 운영 환경에 맞게 조정합니다."
            : "질의 라우팅, 민감정보 마스킹, 감사 로그 수집 상태를 한 화면에서 확인합니다."
        }
      />

      {isSettingsRoute && <SettingsSubNav />}

      <section className="rounded-[24px] border border-border bg-white p-2 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {TWIN_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
                activeTab === tab.key
                  ? "border-[#2454C8] bg-[#eef4ff]"
                  : "border-border bg-white hover:bg-[#f8fbff]"
              }`}
            >
              <p
                className={`text-sm font-semibold ${activeTab === tab.key ? "text-[#2454C8]" : "text-slate-800"}`}
              >
                {tab.label}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">{tab.description}</p>
            </button>
          ))}
        </div>
      </section>

      {activeTab === "data" ? (
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "SQL/API 우선 처리율",
              value: `${sqlPct}%`,
              desc: `${formatCountWithUnit(logs.length, "건")} 중 ${formatCountWithUnit(logs.filter((l) => l.route === PROCESSING_ROUTE.REPOSITORY).length, "건")}`,
              tone: "success",
            },
            {
              label: "민감정보 차단 건수",
              value: formatCountWithUnit(blockedCount, "건"),
              desc: "전체 기준",
              tone: "danger",
            },
            {
              label: "총 처리 건수",
              value: formatCountWithUnit(logs.length, "건"),
              desc: "감사 로그 기준",
              tone: "primary",
            },
          ].map((item) => (
            <article
              key={item.label}
              className="rounded-[26px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {item.label}
              </p>
              <p
                className={`mt-3 text-2xl font-bold ${item.tone === "success" ? "text-green-600" : item.tone === "danger" ? "text-red-600" : "text-[#2454C8]"}`}
              >
                {item.value}
              </p>
              <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
            </article>
          ))}
        </section>
      ) : null}

      {activeTab === "prompt" ? (
        <section className="rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-base font-semibold text-slate-900">시스템 프롬프트 설정</p>
            <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold text-[#2454C8]">
              마지막 수정: {updatedAtText} · {promptSettingsQuery.data?.updated_by ?? "-"}
            </span>
            <button
              type="button"
              onClick={() => {
                void handleSavePromptSettings(user.id);
              }}
              disabled={saveMutation.isPending || promptSettingsQuery.isLoading}
              className="ml-auto rounded-xl bg-[#2454C8] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saveMutation.isPending ? "저장 중..." : "설정 저장"}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            도메인별 빠른 질문, 시스템 지시문, 쿼리 접두 템플릿을 관리합니다.
          </p>

          {promptSettingsQuery.isLoading ? (
            <p className="mt-4 text-sm text-slate-400">프롬프트 설정을 불러오는 중입니다...</p>
          ) : promptSettingsQuery.isError ? (
            <p className="mt-4 text-sm text-red-500">
              프롬프트 설정을 조회하지 못했습니다. (hq_admin 권한 필요)
            </p>
          ) : (
            <div className="mt-4 grid gap-4 xl:grid-cols-3">
              {DOMAIN_KEYS.map((domain) => (
                <article key={domain} className="rounded-2xl border border-border bg-[#f8fbff] p-4">
                  <p className="text-sm font-semibold text-slate-900">{DOMAIN_LABEL[domain]}</p>

                  <label className="mt-3 block text-xs font-semibold text-slate-500">
                    빠른 질문(줄바꿈 구분, 최대 5개)
                  </label>
                  <textarea
                    value={form[domain].quickPromptsText}
                    onChange={(event) =>
                      handleDomainChange(domain, "quickPromptsText", event.target.value)
                    }
                    className="mt-1 h-28 w-full rounded-xl border border-border bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-[#2454C8]"
                  />

                  <label className="mt-3 block text-xs font-semibold text-slate-500">
                    시스템 프롬프트
                  </label>
                  <textarea
                    value={form[domain].systemInstruction}
                    onChange={(event) =>
                      handleDomainChange(domain, "systemInstruction", event.target.value)
                    }
                    className="mt-1 h-28 w-full rounded-xl border border-border bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-[#2454C8]"
                  />

                  <label className="mt-3 block text-xs font-semibold text-slate-500">
                    쿼리 접두 템플릿
                  </label>
                  <input
                    value={form[domain].queryPrefixTemplate}
                    onChange={(event) =>
                      handleDomainChange(domain, "queryPrefixTemplate", event.target.value)
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-[#2454C8]"
                  />
                </article>
              ))}
            </div>
          )}

          {saveMessage ? (
            <p
              className={`mt-3 text-sm ${saveMutation.isError ? "text-red-500" : "text-green-600"}`}
            >
              {saveMessage}
            </p>
          ) : null}
        </section>
      ) : null}

      {activeTab === "logs" ? (
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
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    시각
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    질의 / 이벤트
                  </th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    유형
                  </th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    처리 경로
                  </th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    마스킹
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    역할
                  </th>
                </tr>
              </thead>
              <tbody>
                {logsQuery.isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                      로그를 불러오는 중입니다...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                      아직 기록된 로그가 없어요.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const blocked = isBlocked(log);
                    const meta = log.metadata as Record<string, unknown>;
                    const queryType = typeof meta?.query_type === "string" ? meta.query_type : null;
                    const maskedFields = Array.isArray(meta?.masked_fields)
                      ? (meta.masked_fields as string[])
                      : [];
                    return (
                      <tr
                        key={log.id}
                        className={`border-b border-border/30 last:border-0 ${blocked ? "bg-red-50/30" : "hover:bg-[#f8fbff]"}`}
                      >
                        <td className="px-5 py-3.5 text-xs font-mono text-slate-500">
                          {log.timestamp.slice(11, 19)}
                        </td>
                        <td className="px-4 py-3.5 font-medium text-slate-800 max-w-[220px] truncate">
                          {getQueryFromMetadata(log)}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {queryType ? (
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${QUERY_TYPE_COLOR[queryType] ?? "bg-slate-100 text-slate-600"}`}
                            >
                              {QUERY_TYPE_LABEL[queryType] ?? queryType}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-300">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${ROUTE_COLOR[log.route] ?? "bg-slate-100 text-slate-600"}`}
                          >
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
      ) : null}

      {activeTab === "security" ? (
        <section className="rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
          <div className="flex items-center gap-3 mb-5">
            <Shield className="h-5 w-5 text-primary" />
            <p className="text-base font-semibold text-slate-900">보안 정책 현황</p>
            <span className="ml-auto rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">
              전체 적용 중
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {policyItems.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 rounded-2xl bg-[#f8fbff] px-4 py-3"
              >
                <CheckCircle className="h-4 w-4 shrink-0 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
