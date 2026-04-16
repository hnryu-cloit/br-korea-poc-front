import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { PageHero, StatsGrid } from "@/commons/components/page/page-layout";
import { formatCountWithUnit } from "@/commons/utils/format-count";
import { getDashboardCardChatHistory } from "@/commons/utils/dashboard-card-chat-history";
import { SalesV2ChatPanel } from "@/features/sales/components/SalesV2ChatPanel";
import { SalesV2InsightsSection } from "@/features/sales/components/SalesV2InsightsSection";
import { SalesV2PromptRail } from "@/features/sales/components/SalesV2PromptRail";
import { SALES_V2_QUERY_TYPE_LABEL } from "@/features/sales/constants/sales-v2";
import { useGetSalesInsightsQuery } from "@/features/sales/queries/useGetSalesInsightsQuery";
import { useGetSalesPromptsQuery } from "@/features/sales/queries/useGetSalesPromptsQuery";
import { usePostSalesQueryMutation } from "@/features/sales/queries/usePostSalesQueryMutation";
import type { SalesInsightSection } from "@/features/sales/types/sales";
import type { SalesV2Message } from "@/features/sales/types/sales-v2";
import { toSalesV2Comparison } from "@/features/sales/utils/sales-v2";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";

let salesV2MessageId = 1;

export const SalesScreenV2 = () => {
  const { user } = useDemoSession();
  const location = useLocation();
  const routeState = location.state as {
    source?: string;
    notificationId?: number;
    prompt?: string;
    domain?: string;
    intent?: "view" | "ask";
  } | null;
  const fromDashboardSales = routeState?.source === "dashboard-card-chat" && routeState?.domain === "sales";
  const dashboardChatHistory = fromDashboardSales ? getDashboardCardChatHistory("sales") : [];
  const [messages, setMessages] = useState<SalesV2Message[]>(() =>
    dashboardChatHistory.flatMap((item) => [
      { id: salesV2MessageId++, role: "user" as const, text: item.question },
      { id: salesV2MessageId++, role: "assistant" as const, text: item.answer, blocked: false },
    ]),
  );
  const [input, setInput] = useState(
    fromDashboardSales && dashboardChatHistory.length === 0 && routeState?.intent === "ask"
      ? routeState.prompt ?? ""
      : "",
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  const promptsQuery = useGetSalesPromptsQuery();
  const insightsQuery = useGetSalesInsightsQuery({ store_id: user.storeId });
  const postSalesQueryMutation = usePostSalesQueryMutation();

  const suggestedPrompts = promptsQuery.data ?? [];
  const insightSections = useMemo<SalesInsightSection[]>(() => {
    const data = insightsQuery.data;
    if (!data) return [];
    return [data.peak_hours, data.channel_mix, data.payment_mix, data.menu_mix, data.campaign_seasonality].filter(Boolean) as SalesInsightSection[];
  }, [insightsQuery.data]);

  const salesStats = useMemo(() => {
    const assistantMessages = messages.filter((message) => message.role === "assistant");
    const blockedCount = assistantMessages.filter((message) => message.blocked).length;
    const withEvidence = assistantMessages.filter((message) => message.evidence && message.evidence.length > 0).length;
    const evidencePct = assistantMessages.length > 0 ? Math.round((withEvidence / assistantMessages.length) * 100) : 0;
    return [
      { label: "응답 유형", value: "SQL/API 우선", tone: "primary" as const },
      { label: "추천 질문", value: formatCountWithUnit(suggestedPrompts.length, "개"), tone: "success" as const },
      { label: "출처 포함", value: `${evidencePct}%`, tone: "default" as const },
      { label: "차단 건수", value: formatCountWithUnit(blockedCount, "건"), tone: blockedCount > 0 ? ("danger" as const) : ("default" as const) },
    ];
  }, [messages, suggestedPrompts.length]);

  const latestAssistantMessage = useMemo(
    () => [...messages].reverse().find((message) => message.role === "assistant"),
    [messages],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || postSalesQueryMutation.isPending) return;
      const userMessage: SalesV2Message = { id: salesV2MessageId++, role: "user", text };
      setMessages((current) => [...current, userMessage]);
      setInput("");
      try {
        const response = await postSalesQueryMutation.mutateAsync(text);
        setMessages((current) => [
          ...current,
          {
            id: salesV2MessageId++,
            role: "assistant",
            text: response.text,
            evidence: response.evidence,
            actions: response.actions,
            comparison: toSalesV2Comparison(response.comparison),
            queryType: response.query_type,
            processingRoute: response.processing_route,
            blocked: response.blocked,
          },
        ]);
      } catch {
        setMessages((current) => [
          ...current,
          {
            id: salesV2MessageId++,
            role: "assistant",
            text: "분석 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.",
            blocked: false,
          },
        ]);
      }
    },
    [postSalesQueryMutation],
  );

  useEffect(() => {
    if (routeState?.source === "notification" && routeState.prompt && messages.length === 0) {
      sendMessage(routeState.prompt);
      window.history.replaceState({}, document.title);
    }
  }, [messages.length, routeState?.prompt, routeState?.source, sendMessage]);

  return (
    <div className="space-y-6">
      <PageHero
        title="손익 분석"
        description={
          latestAssistantMessage?.queryType
            ? `최근 ${SALES_V2_QUERY_TYPE_LABEL[latestAssistantMessage.queryType] ?? latestAssistantMessage.queryType} 응답까지 반영해 보여드려요.`
            : "궁금한 것을 물어보시면 분석해 드려요."
        }
      />
      <StatsGrid stats={salesStats} />

      <SalesV2InsightsSection
        sections={insightSections}
        isLoading={insightsQuery.isLoading}
      />

      <section className="grid gap-5 xl:grid-cols-[1fr_300px]">
        <SalesV2ChatPanel
          messages={messages}
          input={input}
          loading={postSalesQueryMutation.isPending}
          bottomRef={bottomRef}
          onChangeInput={setInput}
          onSubmitInput={() => sendMessage(input)}
        />
        <SalesV2PromptRail
          prompts={suggestedPrompts}
          isLoading={promptsQuery.isLoading}
          sending={postSalesQueryMutation.isPending}
          onSelectPrompt={sendMessage}
        />
      </section>
    </div>
  );
};
