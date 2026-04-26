import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import type { AxiosError } from "axios";

import { formatCountWithUnit } from "@/commons/utils/format-count";
import { getDashboardCardChatHistory } from "@/commons/utils/dashboard-card-chat-history";
import { getExplainability } from "@/features/sales/api/sales";
import {
  SALES_OPPORTUNITY_DEFAULT_TAB,
  isSalesOpportunityTabKey,
} from "@/features/sales/constants/sales-opportunity-tabs";
import { useSalesOpportunityData } from "@/features/sales/hooks/useSalesOpportunityData";
import { useGetSalesInsightsQuery } from "@/features/sales/queries/useGetSalesInsightsQuery";
import { useGetSalesMenuInsightsQuery } from "@/features/sales/queries/useGetSalesMenuInsightsQuery";
import { useGetSalesPromptsQuery } from "@/features/sales/queries/useGetSalesPromptsQuery";
import { useGetSalesSummaryQuery } from "@/features/sales/queries/useGetSalesSummaryQuery";
import { usePostSalesQueryMutation } from "@/features/sales/queries/usePostSalesQueryMutation";
import type { SalesInsightSection } from "@/features/sales/types/sales";
import type { SalesOpportunityTabKey } from "@/features/sales/types/sales-opportunity";
import type { SalesV2Message } from "@/features/sales/types/sales-v2";
import { toSalesV2Comparison } from "@/features/sales/utils/sales-v2";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";
import { getDateRange } from "@/commons/utils/getDateRange";

type SalesRouteState = {
  source?: string;
  notificationId?: number;
  prompt?: string;
  domain?: string;
  intent?: "view" | "ask";
  chatHistoryId?: string;
} | null;

export type SalesDateComparisonMode = "daily" | "period";
export type SalesAggregationMode = "weekly" | "monthly";

export const useSalesScreenV2 = () => {
  const { user, referenceDateTime } = useDemoSession();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const routeState = location.state as SalesRouteState;

  const { from: dateFrom, to: dateTo } = useMemo(
    () => getDateRange(referenceDateTime),
    [referenceDateTime],
  );
  const [dateComparisonMode, setDateComparisonMode] = useState<SalesDateComparisonMode>("period");
  const [aggregationMode, setAggregationMode] = useState<SalesAggregationMode>("weekly");
  const [selectedDateFrom, setSelectedDateFrom] = useState(dateFrom);
  const [selectedDateTo, setSelectedDateTo] = useState(dateTo);

  const fromDashboardSales =
    routeState?.source === "dashboard-card-chat" && routeState?.domain === "sales";
  const dashboardChatHistory = useMemo(
    () =>
      routeState?.source === "dashboard-card-chat" &&
      routeState?.domain === "sales" &&
      routeState.chatHistoryId
        ? getDashboardCardChatHistory("sales").filter(
            (item) => item.id === routeState.chatHistoryId,
          )
        : [],
    [routeState],
  );
  const initialMessages = useMemo<SalesV2Message[]>(
    () =>
      dashboardChatHistory.flatMap((item, index) => {
        const baseId = index * 2 + 1;
        return [
          { id: baseId, role: "user" as const, text: item.question },
          {
            id: baseId + 1,
            role: "assistant" as const,
            text: item.answer,
            evidence: item.evidence,
            actions: item.actions,
            blocked: false,
          },
        ];
      }),
    [dashboardChatHistory],
  );
  const messageIdRef = useRef(initialMessages.length + 1);
  const nextMessageId = useCallback(() => {
    const id = messageIdRef.current;
    messageIdRef.current += 1;
    return id;
  }, []);

  const [messages, setMessages] = useState<SalesV2Message[]>(initialMessages);
  const [input, setInput] = useState(
    fromDashboardSales &&
      dashboardChatHistory.length === 0 &&
      routeState?.intent === "ask" &&
      !routeState?.chatHistoryId
      ? (routeState.prompt ?? "")
      : "",
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  const sharedFilters = useMemo(
    () => ({
      store_id: user.storeId,
      date_from: selectedDateFrom,
      date_to: selectedDateTo,
    }),
    [selectedDateFrom, selectedDateTo, user.storeId],
  );

  const promptsQuery = useGetSalesPromptsQuery(sharedFilters);
  const insightsQuery = useGetSalesInsightsQuery(sharedFilters);
  const menuInsightsQuery = useGetSalesMenuInsightsQuery(sharedFilters);
  const summaryQuery = useGetSalesSummaryQuery(sharedFilters);
  const postSalesQueryMutation = usePostSalesQueryMutation(user.storeId, "sales");

  const { opportunity, benchmarkQuery } = useSalesOpportunityData({
    storeId: user.storeId,
    storeName: user.storeName,
    summary: summaryQuery.data,
    insights: insightsQuery.data,
    dateFrom: selectedDateFrom,
    dateTo: selectedDateTo,
    prompts: promptsQuery.data,
  });

  const suggestedPrompts = useMemo(() => {
    const merged = [...(opportunity?.promptSuggestions ?? []), ...(promptsQuery.data ?? [])];
    const uniqueByPrompt = new Map<string, { label: string; prompt: string }>();
    for (const item of merged) {
      if (!uniqueByPrompt.has(item.prompt)) {
        uniqueByPrompt.set(item.prompt, { label: item.label, prompt: item.prompt });
      }
    }
    return Array.from(uniqueByPrompt.values()).slice(0, 10);
  }, [opportunity?.promptSuggestions, promptsQuery.data]);

  const salesErrorMessages = useMemo(() => {
    const summaryError = summaryQuery.error as AxiosError<{ detail?: string }> | null;
    const insightsError = insightsQuery.error as AxiosError<{ detail?: string }> | null;
    const menuInsightsError = menuInsightsQuery.error as AxiosError<{ detail?: string }> | null;
    const benchmarkError = benchmarkQuery.error as Error | null;

    const messages = [
      summaryError?.response?.data?.detail ??
        (summaryError ? "매출 요약 실데이터 조회 중 오류가 발생했습니다." : null),
      insightsError?.response?.data?.detail ??
        (insightsError ? "매출 인사이트 실데이터 조회 중 오류가 발생했습니다." : null),
      menuInsightsError?.response?.data?.detail ??
        (menuInsightsError ? "메뉴 인사이트 생성에 실패했습니다." : null),
      benchmarkError?.message ?? null,
    ].filter((message): message is string => Boolean(message));

    return Array.from(new Set(messages));
  }, [benchmarkQuery.error, insightsQuery.error, menuInsightsQuery.error, summaryQuery.error]);

  const insightSections = useMemo<SalesInsightSection[]>(
    () => menuInsightsQuery.data?.cards ?? [],
    [menuInsightsQuery.data],
  );

  const salesStats = useMemo(() => {
    const assistantMessages = messages.filter((message) => message.role === "assistant");
    const blockedCount = assistantMessages.filter((message) => message.blocked).length;
    const withEvidence = assistantMessages.filter(
      (message) => message.evidence && message.evidence.length > 0,
    ).length;
    const evidencePct =
      assistantMessages.length > 0
        ? Math.round((withEvidence / assistantMessages.length) * 100)
        : 0;
    return [
      { label: "응답 유형", value: "SQL/API 우선", tone: "primary" as const },
      {
        label: "추천 질문",
        value: formatCountWithUnit(suggestedPrompts.length, "개"),
        tone: "success" as const,
      },
      { label: "출처 포함", value: `${evidencePct}%`, tone: "default" as const },
      {
        label: "차단 건수",
        value: formatCountWithUnit(blockedCount, "건"),
        tone: blockedCount > 0 ? ("danger" as const) : ("default" as const),
      },
    ];
  }, [messages, suggestedPrompts.length]);

  const latestAssistantMessage = useMemo(
    () => [...messages].reverse().find((message) => message.role === "assistant"),
    [messages],
  );

  const opportunityTab = useMemo<SalesOpportunityTabKey>(() => {
    const tabParam = searchParams.get("tab");
    return isSalesOpportunityTabKey(tabParam) ? tabParam : SALES_OPPORTUNITY_DEFAULT_TAB;
  }, [searchParams]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || postSalesQueryMutation.isPending) return;
      const userMessage: SalesV2Message = { id: nextMessageId(), role: "user", text };
      setMessages((current) => [...current, userMessage]);
      setInput("");
      try {
        const response = await postSalesQueryMutation.mutateAsync(text);
        const assistantMessageId = nextMessageId();
        setMessages((current) => [
          ...current,
          {
            id: assistantMessageId,
            role: "assistant",
            text: response.text,
            evidence: response.evidence,
            actions: response.actions,
            comparison: toSalesV2Comparison(response.comparison),
            visualData: response.visual_data,
            queryType: response.query_type,
            processingRoute: response.processing_route,
            blocked: response.blocked,
          },
        ]);
        const explainability = response.explainability;
        if (explainability?.trace_id && explainability.status === "pending" && !response.blocked) {
          const maxAttempts = 6;
          for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
            await new Promise((resolve) => setTimeout(resolve, 450));
            try {
              const detail = await getExplainability(explainability.trace_id);
              if (detail.status === "ready" || detail.status === "failed") {
                setMessages((current) =>
                  current.map((message) =>
                    message.id === assistantMessageId
                      ? {
                          ...message,
                          actions: detail.actions?.length ? detail.actions : message.actions,
                          evidence: detail.evidence?.length ? detail.evidence : message.evidence,
                        }
                      : message,
                  ),
                );
                break;
              }
            } catch {
              break;
            }
          }
        }
      } catch {
        setMessages((current) => [
          ...current,
          {
            id: nextMessageId(),
            role: "assistant",
            text: "분석 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.",
            blocked: false,
          },
        ]);
      }
    },
    [nextMessageId, postSalesQueryMutation],
  );

  useEffect(() => {
    if (routeState?.source === "notification" && routeState.prompt && messages.length === 0) {
      sendMessage(routeState.prompt);
      window.history.replaceState({}, document.title);
    }
  }, [messages.length, routeState?.prompt, routeState?.source, sendMessage]);

  const handleChangeOpportunityTab = useCallback(
    (tab: SalesOpportunityTabKey) => {
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.set("tab", tab);
      setSearchParams(nextSearchParams, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const handleChangeDateFrom = useCallback(
    (value: string) => {
      setSelectedDateFrom(value);
      if (dateComparisonMode === "daily") {
        setSelectedDateTo(value);
        return;
      }

      if (selectedDateTo < value) {
        setSelectedDateTo(value);
      }
    },
    [dateComparisonMode, selectedDateTo],
  );

  const handleChangeDateTo = useCallback(
    (value: string) => {
      setSelectedDateTo(value);
      if (selectedDateFrom > value) {
        setSelectedDateFrom(value);
      }
    },
    [selectedDateFrom],
  );

  const handleChangeDateComparisonMode = useCallback(
    (value: SalesDateComparisonMode) => {
      setDateComparisonMode(value);
      if (value === "daily") {
        setSelectedDateTo(selectedDateFrom);
      } else {
        const defaultRange = getDateRange(referenceDateTime);
        setSelectedDateFrom(defaultRange.from);
        setSelectedDateTo(defaultRange.to);
      }
    },
    [referenceDateTime, selectedDateFrom],
  );

  const handleChangeAggregationMode = useCallback((value: SalesAggregationMode) => {
    setAggregationMode(value);
  }, []);

  return {
    dateFrom: selectedDateFrom,
    dateTo: selectedDateTo,
    dateComparisonMode,
    aggregationMode,
    input,
    messages,
    bottomRef,
    opportunity,
    opportunityTab,
    insightSections,
    salesStats,
    suggestedPrompts,
    latestAssistantMessage,
    summaryData: summaryQuery.data,
    salesErrorMessages,
    insightsLoading: menuInsightsQuery.isLoading,
    summaryLoading: summaryQuery.isLoading,
    promptsLoading: promptsQuery.isLoading,
    sending: postSalesQueryMutation.isPending,
    setInput,
    sendMessage,
    handleChangeDateFrom,
    handleChangeDateTo,
    handleChangeDateComparisonMode,
    handleChangeAggregationMode,
    handleChangeOpportunityTab,
  };
};
