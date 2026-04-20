import { useState } from "react";
import { useLocation } from "react-router-dom";

import { getDashboardCardChatHistory } from "@/commons/utils/dashboard-card-chat-history";
import { ProductionHero } from "@/features/production/components/ProductionHero";
import { ProductionInventoryStatusSection } from "@/features/production/components/ProductionInventoryStatusSection";
import { ProductionQuickChat } from "@/features/production/components/ProductionQuickChat";
import { useGetProductionInventoryStatusQuery } from "@/features/production/queries/useGetProductionInventoryStatusQuery";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";

export function ProductionInventoryDiagnosisScreen() {
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

  const inventoryStatusQuery = useGetProductionInventoryStatusQuery(user.storeId ?? "");
  const dashboardChatHistory = fromDashboardProduction && routeState?.chatHistoryId
    ? getDashboardCardChatHistory("production").filter((item) => item.id === routeState.chatHistoryId)
    : [];

  return (
    <div className="space-y-6">
      <ProductionHero
        showChat={showChat}
        onToggleChat={() => setShowChat((value) => !value)}
        title="재고 수준 진단"
        // description="5분 단위 자동 갱신 재고와 1시간 후 예측, 4주 평균 생산 패턴을 기준으로 생산 필요 시점을 자동 감지합니다."
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
      <ProductionInventoryStatusSection data={inventoryStatusQuery.data} isLoading={inventoryStatusQuery.isLoading} />
    </div>
  );
}
