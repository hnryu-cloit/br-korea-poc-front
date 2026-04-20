import { useState } from "react";
import { useLocation } from "react-router-dom";

import { ProductionHero } from "@/features/production/components/ProductionHero";
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

  return (
    <div className="space-y-6">
      <ProductionHero
        showChat={showChat}
        onToggleChat={() => setShowChat((value) => !value)}
        title="폐기 손실 현황"
        description=""
      />
      <ProductionWasteSection data={wasteQuery.data} isLoading={wasteQuery.isLoading} />
    </div>
  );
}
