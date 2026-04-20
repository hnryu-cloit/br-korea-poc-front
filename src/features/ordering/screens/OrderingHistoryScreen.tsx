import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { StatsGrid } from "@/commons/components/page/page-layout";
import type { HighlightStat } from "@/commons/constants/page-content";
import { getDashboardCardChatHistory } from "@/commons/utils/dashboard-card-chat-history";
import { formatCountWithUnit } from "@/commons/utils/format-count";
import { OrderingHero } from "@/features/ordering/components/OrderingHero";
import { OrderingHistorySection } from "@/features/ordering/components/OrderingHistorySection";
import { OrderingQuickChat } from "@/features/ordering/components/OrderingQuickChat";
import { useGetOrderingHistoryQuery } from "@/features/ordering/queries/useGetOrderingHistoryQuery";
import { useGetSalesPromptsQuery } from "@/features/sales/queries/useGetSalesPromptsQuery";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";

export function OrderingHistoryScreen() {
  const location = useLocation();
  const routeState = location.state as {
    source?: string;
    domain?: string;
    intent?: "view" | "ask";
    prompt?: string;
    chatHistoryId?: string;
  } | null;

  const fromDashboardOrdering = routeState?.source === "dashboard-card-chat" && routeState?.domain === "ordering";
  const { user } = useDemoSession();
  const [showChat, setShowChat] = useState(fromDashboardOrdering);

  const historyQuery = useGetOrderingHistoryQuery(user.storeId);
  const orderingPromptsQuery = useGetSalesPromptsQuery({ store_id: user.storeId, domain: "ordering" });

  const quickPromptCandidates = useMemo(() => {
    const aiPrompts = (orderingPromptsQuery.data ?? []).map((item) => item.prompt).filter(Boolean);
    if (aiPrompts.length > 0) {
      return aiPrompts.slice(0, 4);
    }
    return [
      "최근 자동 발주 비중이 늘어난 이유를 알려줘",
      "수동 발주가 많은 품목 원인을 분석해줘",
      "최근 발주량과 확정량 차이가 큰 품목을 알려줘",
      `${user.storeName} 발주 패턴 개선 포인트를 정리해줘`,
    ];
  }, [orderingPromptsQuery.data, user.storeName]);

  const dashboardChatHistory = fromDashboardOrdering && routeState?.chatHistoryId
    ? getDashboardCardChatHistory("ordering").filter((item) => item.id === routeState.chatHistoryId)
    : [];

  const orderingHistoryStats: HighlightStat[] = [
    {
      label: "총 발주 건수",
      value: historyQuery.data ? formatCountWithUnit(historyQuery.data.total_count, "건") : "-",
      tone: "primary" as const,
    },
    {
      label: "자동 발주 비중",
      value: historyQuery.data ? `${Math.round(historyQuery.data.auto_rate * 100)}%` : "-",
      tone: "success" as const,
    },
    {
      label: "수동 발주 비중",
      value: historyQuery.data ? `${Math.round(historyQuery.data.manual_rate * 100)}%` : "-",
      tone: "default" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <OrderingHero showChat={showChat} onToggleChat={() => setShowChat((value) => !value)} />
      {showChat ? (
        <OrderingQuickChat
          prompts={quickPromptCandidates}
          initialHistory={dashboardChatHistory}
          initialInput={
            fromDashboardOrdering && dashboardChatHistory.length === 0 && routeState?.intent === "ask"
              && !routeState?.chatHistoryId
              ? routeState.prompt ?? ""
              : ""
          }
        />
      ) : null}
      <StatsGrid stats={orderingHistoryStats} />
      <OrderingHistorySection data={historyQuery.data} isLoading={historyQuery.isLoading} />
    </div>
  );
}
