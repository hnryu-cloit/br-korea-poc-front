import { Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { orchestrationStats } from "@/data/page-content";
import { PageHero, StatsGrid } from "@/pages/shared";

type LogEntry = {
  id: number;
  time: string;
  query: string;
  queryType: "FAQ" | "데이터 조회" | "분석" | "민감정보";
  route: "SQL" | "API" | "SQL+RAG" | "SQL+LLM" | "차단";
  masked: boolean;
  tokens: number;
  user: string;
  role: string;
};

const auditLogs: LogEntry[] = [
  { id: 1, time: "14:02:11", query: "이번 주 배달 건수 조회", queryType: "데이터 조회", route: "SQL", masked: false, tokens: 0, user: "김점주", role: "가맹점주" },
  { id: 2, time: "13:55:43", query: "매출 손익 원본 데이터 요청", queryType: "민감정보", route: "차단", masked: true, tokens: 0, user: "박담당", role: "본사 담당자" },
  { id: 3, time: "13:48:22", query: "T-day 이후 재방문 분석", queryType: "분석", route: "SQL+RAG", masked: false, tokens: 312, user: "김점주", role: "가맹점주" },
  { id: 4, time: "13:21:08", query: "오전 채널별 매출 비교", queryType: "데이터 조회", route: "SQL", masked: false, tokens: 0, user: "이SV", role: "수퍼바이저" },
  { id: 5, time: "12:55:30", query: "커피 세트 전환율 개선 방안", queryType: "분석", route: "SQL+LLM", masked: false, tokens: 428, user: "김점주", role: "가맹점주" },
  { id: 6, time: "12:30:15", query: "캠페인 ROI 산출 내역", queryType: "민감정보", route: "차단", masked: true, tokens: 0, user: "최마케터", role: "본사 마케터" },
  { id: 7, time: "11:44:02", query: "생산 알림 FAQ", queryType: "FAQ", route: "API", masked: false, tokens: 0, user: "김점주", role: "가맹점주" },
];

const routeColor: Record<LogEntry["route"], string> = {
  SQL: "bg-[#eef4ff] text-[#2454C8]",
  API: "bg-purple-50 text-purple-600",
  "SQL+RAG": "bg-teal-50 text-teal-600",
  "SQL+LLM": "bg-orange-50 text-orange-600",
  차단: "bg-red-50 text-red-600",
};

const queryTypeColor: Record<LogEntry["queryType"], string> = {
  FAQ: "bg-slate-100 text-slate-600",
  "데이터 조회": "bg-[#eef4ff] text-[#2454C8]",
  분석: "bg-orange-50 text-orange-600",
  민감정보: "bg-red-50 text-red-600",
};

const policyItems = [
  { label: "민감정보 마스킹", description: "매출, 손익, 생산량 원본 → 집계값 또는 차단", status: "active" },
  { label: "역할 기반 접근 제어", description: "점주 / 운영 / 본사 조회 범위 분리 적용", status: "active" },
  { label: "감사 로그 수집", description: "프롬프트, 응답, 라우팅 경로 감사 가능 저장", status: "active" },
  { label: "RAG 출처 응답", description: "환각 위험 시 조회형 응답으로 다운그레이드", status: "active" },
  { label: "LLM 호출 최소화", description: "정형 조회는 SQL/API 우선 처리, 토큰 추적", status: "active" },
  { label: "퍼블릭 LLM 직접 전송 제한", description: "민감정보 마스킹 후 요약 컨텍스트만 전달", status: "active" },
];

const sqlPct = Math.round(auditLogs.filter((l) => l.route === "SQL" || l.route === "API").length / auditLogs.length * 100);
const blockedCount = auditLogs.filter((l) => l.route === "차단").length;
const totalTokens = auditLogs.reduce((s, l) => s + l.tokens, 0);

export function OrchestrationPage() {
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
          { label: "SQL/API 우선 처리율", value: `${sqlPct}%`, desc: `${auditLogs.length}건 중 ${auditLogs.filter((l) => l.route === "SQL" || l.route === "API").length}건`, tone: "success" },
          { label: "민감정보 차단 건수", value: `${blockedCount}건`, desc: "오늘 기준", tone: "danger" },
          { label: "총 LLM 토큰 사용", value: totalTokens.toLocaleString(), desc: "평균 " + Math.round(totalTokens / auditLogs.filter((l) => l.tokens > 0).length) + "토큰/LLM 질의", tone: "primary" },
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
            <p className="text-xs text-slate-400 mt-0.5">오늘 전체 질의 기록 · 감사 가능 저장 완료</p>
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
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">질의</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">유형</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">처리 경로</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">마스킹</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">토큰</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">사용자</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} className={`border-b border-border/30 last:border-0 ${log.route === "차단" ? "bg-red-50/30" : "hover:bg-[#f8fbff]"}`}>
                  <td className="px-5 py-3.5 text-xs font-mono text-slate-500">{log.time}</td>
                  <td className="px-4 py-3.5 font-medium text-slate-800">{log.query}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${queryTypeColor[log.queryType]}`}>
                      {log.queryType}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${routeColor[log.route]}`}>
                      {log.route}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {log.masked ? (
                      <span className="flex items-center justify-center gap-1 text-xs font-medium text-orange-500">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        적용
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center text-xs font-medium text-slate-600">
                    {log.tokens > 0 ? log.tokens.toLocaleString() : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-slate-800">{log.user}</p>
                    <p className="text-xs text-slate-400">{log.role}</p>
                  </td>
                </tr>
              ))}
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
