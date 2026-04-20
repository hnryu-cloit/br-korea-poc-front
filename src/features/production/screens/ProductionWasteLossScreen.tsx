import { useState } from "react";
import { useLocation } from "react-router-dom";

import { getDashboardCardChatHistory } from "@/commons/utils/dashboard-card-chat-history";
import { ProductionHero } from "@/features/production/components/ProductionHero";
import { ProductionQuickChat } from "@/features/production/components/ProductionQuickChat";
import { ProductionWasteSection } from "@/features/production/components/ProductionWasteSection";
import { useGetProductionWasteQuery } from "@/features/production/queries/useGetProductionWasteQuery";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";

export function ProductionWasteLossScreen() {
  const location = useLocation();
  const routeState = location.state as {
    source?: string;
    domain?: string;
    intent?: "view" | "ask";
    prompt?: string;
    chatHistoryId?: string;
  } | null;
  const fromDashboardProduction = routeState?.source === "dashboard-card-chat" && routeState?.domain === "production";
  const { user } = useDemoSession();
  const [showChat, setShowChat] = useState(fromDashboardProduction);

  const wasteQuery = useGetProductionWasteQuery(user.storeId ?? "");
  const dashboardChatHistory = fromDashboardProduction && routeState?.chatHistoryId
    ? getDashboardCardChatHistory("production").filter((item) => item.id === routeState.chatHistoryId)
    : [];

  return (
    <div className="space-y-6">
      <ProductionHero
        showChat={showChat}
        onToggleChat={() => setShowChat((value) => !value)}
        title="폐기 손실 현황"
        description=""
      />
      {showChat ? (
        <ProductionQuickChat
          initialHistory={dashboardChatHistory}
          initialInput={
            fromDashboardProduction && dashboardChatHistory.length === 0 && routeState?.intent === "ask"
              && !routeState?.chatHistoryId
              ? routeState.prompt ?? ""
              : ""
          }
        />
      ) : null}
      <ProductionWasteSection data={wasteQuery.data} isLoading={wasteQuery.isLoading} />
    </div>
  );
}
