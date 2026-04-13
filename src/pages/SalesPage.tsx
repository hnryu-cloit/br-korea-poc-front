import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Send, BarChart3, ShieldAlert } from "lucide-react";

import { SectionHint } from "@/components/ui/SectionHint";
import { sessionUser } from "@/data/session-user";
import { PageHero, StatsGrid } from "@/pages/shared";
import {
  fetchSalesInsights,
  fetchSalesPrompts,
  querySales,
  type SalesInsightSection,
  type SalesQueryResponse,
} from "@/lib/api";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  text: string;
  evidence?: string[];
  actions?: string[];
  comparison?: {
    store: string;
    peerGroup: string;
    summary: string;
    metrics: { label: string; storeValue: string; peerValue: string }[];
  };
  queryType?: string | null;
  processingRoute?: string | null;
  blocked?: boolean;
};

const ROUTE_STYLE: Record<string, string> = {
  ai_proxy: "bg-orange-50 text-orange-600",
  stub_repository: "bg-[#eef4ff] text-[#2454C8]",
  policy_block: "bg-red-50 text-red-600",
};

const ROUTE_LABEL: Record<string, string> = {
  ai_proxy: "AI",
  stub_repository: "SQL/API",
  policy_block: "차단",
};

const QUERY_TYPE_STYLE: Record<string, string> = {
  analysis: "bg-orange-50 text-orange-600",
  data_lookup: "bg-[#eef4ff] text-[#2454C8]",
  faq: "bg-slate-100 text-slate-600",
  sensitive_request: "bg-red-50 text-red-600",
};

const QUERY_TYPE_LABEL: Record<string, string> = {
  analysis: "분석",
  data_lookup: "데이터 조회",
  faq: "FAQ",
  sensitive_request: "민감정보",
};

function toComparison(raw: SalesQueryResponse["comparison"]): ChatMessage["comparison"] | undefined {
  if (!raw) return undefined;
  return {
    store: raw.store,
    peerGroup: raw.peer_group,
    summary: raw.summary,
    metrics: raw.metrics.map((m) => ({
      label: m.label,
      storeValue: m.store_value,
      peerValue: m.peer_value,
    })),
  };
}

let msgId = 1;

export function SalesPage() {
  const location = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const promptsQuery = useQuery({
    queryKey: ["sales-prompts"],
    queryFn: fetchSalesPrompts,
  });
  const salesInsightsQuery = useQuery({
    queryKey: ["sales-insights", sessionUser.storeId],
    queryFn: () => fetchSalesInsights({ storeId: sessionUser.storeId }),
  });

  const suggestedPrompts = promptsQuery.data ?? [];
  const insightSections = useMemo<SalesInsightSection[]>(() => {
    const data = salesInsightsQuery.data;
    if (!data) return [];
    return [data.peak_hours, data.channel_mix, data.payment_mix, data.menu_mix, data.campaign_seasonality].filter(Boolean) as SalesInsightSection[];
  }, [salesInsightsQuery.data]);

  const salesStats = useMemo(() => {
    const assistantMsgs = messages.filter((m) => m.role === "assistant");
    const blockedCount = assistantMsgs.filter((m) => m.blocked).length;
    const withEvidence = assistantMsgs.filter((m) => m.evidence && m.evidence.length > 0).length;
    const evidencePct = assistantMsgs.length > 0 ? Math.round((withEvidence / assistantMsgs.length) * 100) : 0;
    return [
      { label: "응답 유형", value: "SQL/API 우선", tone: "primary" as const },
      { label: "추천 질문", value: `${suggestedPrompts.length}개`, tone: "success" as const },
      { label: "출처 포함", value: `${evidencePct}%`, tone: "default" as const },
      { label: "차단 건수", value: `${blockedCount}건`, tone: blockedCount > 0 ? ("danger" as const) : ("default" as const) },
    ];
  }, [messages, suggestedPrompts.length]);
  const latestAssistantMessage = useMemo(
    () => [...messages].reverse().find((message) => message.role === "assistant"),
    [messages],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { id: msgId++, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await querySales(text);
      setMessages((prev) => [
        ...prev,
        {
          id: msgId++,
          role: "assistant",
          text: res.text,
          evidence: res.evidence,
          actions: res.actions,
          comparison: toComparison(res.comparison),
          queryType: res.query_type,
          processingRoute: res.processing_route,
          blocked: res.blocked,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: msgId++,
          role: "assistant",
          text: "분석 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.",
          blocked: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    const state = location.state as { source?: string; notificationId?: number; prompt?: string } | null;
    if (state?.source === "notification" && state.prompt && messages.length === 0) {
      sendMessage(state.prompt);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, messages.length, sendMessage]);

  return (
    <div className="space-y-6">
      <PageHero
        title="매출 현황"
        description={
          latestAssistantMessage?.queryType
            ? `최근 ${QUERY_TYPE_LABEL[latestAssistantMessage.queryType] ?? latestAssistantMessage.queryType} 응답까지 반영해 보여드려요.`
            : "궁금한 것을 물어보시면 분석해 드려요."
        }
      />
      <StatsGrid stats={salesStats} />

      <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
        {insightSections.map((section) => (
          <article
            key={section.title}
            className="rounded-[28px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-800">{section.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">{section.summary}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${section.status === "active" ? "bg-[#eef4ff] text-[#2454C8]" : "bg-slate-100 text-slate-500"}`}>
                {section.status === "active" ? "실데이터" : "점검"}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {section.metrics.map((metric) => (
                <div key={`${section.title}-${metric.label}`} className="rounded-2xl bg-[#f8fbff] px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-semibold text-slate-400">{metric.label}</p>
                    <p className="text-sm font-bold text-slate-800">{metric.value}</p>
                  </div>
                  {metric.detail ? <p className="mt-1 text-[11px] text-slate-500">{metric.detail}</p> : null}
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-1.5">
              {section.actions.slice(0, 2).map((action) => (
                <div key={action} className="flex items-start gap-2 rounded-xl bg-[#EDF3FF] px-3 py-2 text-xs font-medium text-[#2454C8]">
                  <span className="material-symbols-outlined mt-0.5 shrink-0 text-[14px]">task_alt</span>
                  {action}
                </div>
              ))}
            </div>
          </article>
        ))}
        {salesInsightsQuery.isLoading ? (
          <div className="rounded-[28px] border border-border bg-white px-5 py-5 text-sm text-slate-400 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
            인사이트를 불러오는 중...
          </div>
        ) : null}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_300px]">
        <div className="flex min-h-[520px] flex-col overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
          <div className="flex items-center justify-between gap-3 border-b border-border/60 px-6 py-4">
            <div>
              <p className="text-sm font-bold text-slate-800">매출 분석</p>
              <p className="mt-0.5 text-xs text-slate-400">
                {latestAssistantMessage
                  ? `최근 응답 경로는 ${ROUTE_LABEL[latestAssistantMessage.processingRoute ?? ""] ?? "분석"} 기준입니다`
                  : "아래에 궁금한 내용을 입력하거나 오른쪽 버튼을 눌러보세요"}
              </p>
            </div>
            <SectionHint
              questions={[
                { q: "어떻게 물어보면 되나요?", a: "평소 말하듯이 입력하시면 돼요. 예를 들어 '이번 주 배달이 왜 줄었나요?' 처럼 입력하면 분석해 드려요." },
                { q: "오른쪽 버튼은 뭔가요?", a: "자주 묻는 질문들이에요. 버튼을 누르면 바로 분석해 드려요. 직접 입력하기 어려우시면 눌러보세요." },
              ]}
            />
          </div>

          <div className="max-h-[420px] flex-1 space-y-5 overflow-y-auto px-5 py-5">
            {messages.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center text-center">
                <BarChart3 className="mb-3 h-10 w-10 text-slate-200" />
                <p className="text-sm font-medium text-slate-400">오른쪽에서 질문을 선택하거나</p>
                <p className="text-sm text-slate-400">아래에 직접 입력해 보세요</p>
              </div>
            ) : null}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "user" ? (
                  <div className="max-w-[80%] rounded-[20px] rounded-br-sm bg-[#2454C8] px-4 py-3 text-sm text-white">
                    {msg.text}
                  </div>
                ) : (
                  <div className="max-w-[90%] space-y-3">
                    <div className={`rounded-[20px] rounded-bl-sm border px-5 py-4 ${msg.blocked ? "border-red-200 bg-red-50" : "border-border bg-[#f8fbff]"}`}>
                      {msg.blocked ? (
                        <div className="flex items-start gap-2">
                          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                          <p className="text-sm leading-6 text-red-700">{msg.text}</p>
                        </div>
                      ) : (
                        <p className="text-sm leading-6 text-slate-700">{msg.text}</p>
                      )}

                      {msg.evidence && !msg.blocked ? (
                        <div className="mt-3 space-y-1.5">
                          <p className="text-[11px] font-bold text-slate-400">확인한 데이터</p>
                          {msg.evidence.map((e) => (
                            <div key={e} className="rounded-xl bg-white px-3 py-2 text-xs text-slate-500 shadow-sm">{e}</div>
                          ))}
                        </div>
                      ) : null}

                      {msg.actions && !msg.blocked ? (
                        <div className="mt-3 space-y-1.5">
                          <p className="text-[11px] font-bold text-slate-400">할 수 있는 것</p>
                          {msg.actions.map((a) => (
                            <div key={a} className="flex items-start gap-2 rounded-xl bg-[#EDF3FF] px-3 py-2 text-xs font-medium text-[#2454C8]">
                              <span className="material-symbols-outlined mt-0.5 shrink-0 text-[14px]">task_alt</span>
                              {a}
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {msg.comparison ? (
                        <div className="mt-3 rounded-2xl border border-[#dbe6fb] bg-white px-4 py-4 shadow-sm">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[11px] font-bold text-slate-400">매장 맞춤 비교</p>
                              <p className="mt-1 text-sm font-semibold text-slate-800">
                                {msg.comparison.store} vs {msg.comparison.peerGroup}
                              </p>
                              <p className="mt-1 text-xs leading-5 text-slate-500">{msg.comparison.summary}</p>
                            </div>
                            <span className="rounded-full bg-[#eef4ff] px-2.5 py-1 text-[10px] font-bold text-[#2454C8]">
                              맞춤형
                            </span>
                          </div>
                          <div className="mt-3 grid gap-2 sm:grid-cols-3">
                            {msg.comparison.metrics.map((metric) => (
                              <div key={metric.label} className="rounded-xl bg-[#f8fbff] px-3 py-3">
                                <p className="text-[11px] font-semibold text-slate-400">{metric.label}</p>
                                <p className="mt-1 text-sm font-bold text-slate-800">{metric.storeValue}</p>
                                <p className="mt-1 text-[11px] text-slate-500">비교군 {metric.peerValue}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {msg.queryType || msg.processingRoute ? (
                        <div className="mt-3 flex items-center gap-1.5">
                          {msg.queryType ? (
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${QUERY_TYPE_STYLE[msg.queryType] ?? "bg-slate-100 text-slate-600"}`}>
                              {QUERY_TYPE_LABEL[msg.queryType] ?? msg.queryType}
                            </span>
                          ) : null}
                          {msg.processingRoute ? (
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${ROUTE_STYLE[msg.processingRoute] ?? "bg-slate-100 text-slate-600"}`}>
                              {ROUTE_LABEL[msg.processingRoute] ?? msg.processingRoute}
                            </span>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading ? (
              <div className="flex justify-start">
                <div className="rounded-[20px] rounded-bl-sm border border-border bg-[#f8fbff] px-5 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                    분석 중...
                  </div>
                </div>
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-border/60 px-4 py-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="예: 이번 주 배달이 왜 줄었을까요?"
                className="flex-1 rounded-xl border border-[#dce4f3] bg-[#f7faff] px-4 py-3 text-sm text-slate-800 placeholder:text-slate-300 focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2454C8] text-white hover:bg-[#1d44a8] disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
          <p className="mb-1 text-sm font-bold text-slate-800">자주 묻는 질문</p>
          <p className="mb-4 text-xs text-slate-400">현재 {suggestedPrompts.length}개 질문을 바로 실행할 수 있어요</p>
          <div className="space-y-2">
            {promptsQuery.isLoading ? (
              <p className="px-1 text-xs text-slate-400">불러오는 중...</p>
            ) : (
              suggestedPrompts.map((p) => (
                <button
                  key={p.prompt}
                  type="button"
                  onClick={() => sendMessage(p.prompt)}
                  className="w-full rounded-2xl border border-border bg-[#f8fbff] px-4 py-3 text-left text-sm transition-colors hover:border-[#bfd1ed] hover:bg-[#eef4ff]"
                >
                  <p className="text-sm font-semibold text-slate-700">{p.label}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{p.category}</p>
                </button>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
