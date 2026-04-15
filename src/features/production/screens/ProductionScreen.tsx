import { useState } from "react";
import { useLocation } from "react-router-dom";

import { AppModal } from "@/commons/components/modal/AppModal";
import { StatsGrid } from "@/commons/components/page/page-layout";
import { getDashboardCardChatHistory } from "@/commons/utils/dashboard-card-chat-history";
import { ProductionAlertsSection } from "@/features/production/components/ProductionAlertsSection";
import { ProductionHero } from "@/features/production/components/ProductionHero";
import { ProductionQuickChat } from "@/features/production/components/ProductionQuickChat";
import { ProductionRegistrationPanel } from "@/features/production/components/ProductionRegistrationPanel";
import { ProductionTableSection } from "@/features/production/components/ProductionTableSection";
import { useGetProductionSkuDetailQuery } from "@/features/production/queries/useGetProductionSkuDetailQuery";
import { useGetProductionOverviewQuery } from "@/features/production/queries/useGetProductionOverviewQuery";
import { useGetProductionSkuListQuery } from "@/features/production/queries/useGetProductionSkuListQuery";
import { usePostProductionRegistrationMutation } from "@/features/production/queries/usePostProductionRegistrationMutation";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";
import type {
  ProductionSkuItem,
} from "@/features/production/types/production";

export function ProductionPage() {
  const location = useLocation();
  const routeState = location.state as {
    source?: string;
    domain?: string;
    intent?: "view" | "ask";
    prompt?: string;
  } | null;
  const fromDashboardProduction = routeState?.source === "dashboard-card-chat" && routeState?.domain === "production";
  const { user } = useDemoSession();
  const [activeSku, setActiveSku] = useState<ProductionSkuItem | null>(null);
  const [activeSkuId, setActiveSkuId] = useState<string | null>(null);
  const [qty, setQty] = useState("48");
  const [showChat, setShowChat] = useState(fromDashboardProduction);
  const [page, setPage] = useState(1);

  const overviewQuery = useGetProductionOverviewQuery();
  const skuListQuery = useGetProductionSkuListQuery({
    page,
    page_size: 20,
    store_id: user.storeId,
  });
  const skuDetailQuery = useGetProductionSkuDetailQuery(activeSkuId, user.storeId);
  const postRegistrationMutation = usePostProductionRegistrationMutation();

  const items = skuListQuery.data?.items ?? [];
  const stats = overviewQuery.data?.summary_stats ?? [];
  const alerts = overviewQuery.data?.alerts ?? [];
  const dashboardChatHistory = fromDashboardProduction ? getDashboardCardChatHistory("production") : [];

  const openRegister = (sku: ProductionSkuItem) => {
    setActiveSku(sku);
    setActiveSkuId(sku.sku_id);
    setQty(String(sku.recommended_production_qty ?? sku.avg_first_production_qty_4w ?? 0));
  };

  const closeRegister = () => {
    setActiveSku(null);
    setActiveSkuId(null);
  };

  const submitRegistration = async () => {
    if (!activeSku) return;
    const parsedQty = Number.parseInt(qty, 10);
    if (!Number.isFinite(parsedQty) || parsedQty <= 0) return;
    await postRegistrationMutation.mutateAsync({
      sku_id: activeSku.sku_id,
      qty: parsedQty,
      store_id: user.storeId,
    });
    closeRegister();
  };

  return (
    <div className="space-y-6">
      <ProductionHero
        updatedAt={overviewQuery.data?.updated_at}
        showChat={showChat}
        onToggleChat={() => setShowChat((value) => !value)}
      />
      {showChat ? (
        <ProductionQuickChat
          initialHistory={dashboardChatHistory}
          initialInput={
            fromDashboardProduction && dashboardChatHistory.length === 0 && routeState?.intent === "ask"
              ? routeState.prompt ?? ""
              : ""
          }
        />
      ) : null}
      <ProductionAlertsSection alerts={alerts} items={items} />
      <StatsGrid stats={stats} />
      <ProductionTableSection
        items={items}
        pagination={skuListQuery.data?.pagination}
        onChangePage={setPage}
        onOpenRegister={openRegister}
      />
      {activeSku ? (
        <AppModal onClose={closeRegister}>
          <ProductionRegistrationPanel
            activeSku={activeSku}
            form={skuDetailQuery.data}
            qty={qty}
            onChangeQty={setQty}
            onSubmit={submitRegistration}
            isSubmitting={postRegistrationMutation.isPending}
            onClose={closeRegister}
          />
        </AppModal>
      ) : null}
    </div>
  );
}
