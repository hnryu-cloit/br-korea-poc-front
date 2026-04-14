import { useMemo, useState } from "react";

import { AppModal } from "@/commons/components/modal/AppModal";
import { StatsGrid } from "@/commons/components/page/page-layout";
import { ProductionAlertsSection } from "@/features/production/components/ProductionAlertsSection";
import { ProductionHero } from "@/features/production/components/ProductionHero";
import { ProductionQuickChat } from "@/features/production/components/ProductionQuickChat";
import { ProductionRegistrationPanel } from "@/features/production/components/ProductionRegistrationPanel";
import { ProductionTableSection } from "@/features/production/components/ProductionTableSection";
import { useGetProductionAlertsQuery } from "@/features/production/queries/useGetProductionAlertsQuery";
import { useGetProductionOverviewQuery } from "@/features/production/queries/useGetProductionOverviewQuery";
import {
  mapAlertsToUiAlerts,
  mapOverviewToSkuItems,
  mapSkuItemsToSummaryStats,
  mapSkuToRegistrationForm,
} from "@/features/production/utils/productionViewAdapter";
import type {
  ProductionSkuItem,
} from "@/features/production/types/production";

export function ProductionPage() {
  const [activeSku, setActiveSku] = useState<ProductionSkuItem | null>(null);
  const [qty, setQty] = useState("48");
  const [showChat, setShowChat] = useState(false);

  const overviewQuery = useGetProductionOverviewQuery();
  const alertsQuery = useGetProductionAlertsQuery();

  const items = useMemo(() => mapOverviewToSkuItems(overviewQuery.data?.items ?? []), [overviewQuery.data?.items]);
  const stats = useMemo(() => mapSkuItemsToSummaryStats(items), [items]);
  const alerts = useMemo(
    () => mapAlertsToUiAlerts(items, alertsQuery.data?.alerts ?? []),
    [alertsQuery.data?.alerts, items],
  );

  const openRegister = (sku: ProductionSkuItem) => {
    setActiveSku(sku);
    setQty(String(sku.recommended_production_qty ?? sku.avg_first_production_qty_4w));
  };

  return (
    <div className="space-y-6">
      <ProductionHero
        updatedAt={overviewQuery.data?.updated_at}
        showChat={showChat}
        onToggleChat={() => setShowChat((value) => !value)}
      />
      {showChat ? <ProductionQuickChat /> : null}
      <ProductionAlertsSection alerts={alerts} items={items} onOpenRegister={openRegister} />
      <StatsGrid stats={stats} />
      <ProductionTableSection items={items} onOpenRegister={openRegister} />
      {activeSku ? (
        <AppModal onClose={() => setActiveSku(null)}>
          <ProductionRegistrationPanel
            activeSku={activeSku}
            form={mapSkuToRegistrationForm(activeSku)}
            qty={qty}
            onChangeQty={setQty}
            onClose={() => setActiveSku(null)}
          />
        </AppModal>
      ) : null}
    </div>
  );
}
