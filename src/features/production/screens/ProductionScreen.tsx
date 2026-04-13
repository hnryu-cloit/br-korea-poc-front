import { useMemo, useState } from "react";

import { AppModal } from "@/components/common/modal/AppModal";
import { StatsGrid } from "@/components/common/page";
import {
  ProductionAlertsSection,
  ProductionHero,
  ProductionQuickChat,
  ProductionRegistrationPanel,
  ProductionTableSection,
} from "@/features/production/components";
import {
  useProductionOverviewQuery,
  useProductionRegistrationFormQuery,
} from "@/features/production/queries";
import type { ProductionSkuItem } from "@/features/production/type/production";
import { sessionUser } from "@/features/session/constants/session-user";

export function ProductionPage() {
  const [activeSku, setActiveSku] = useState<ProductionSkuItem | null>(null);
  const [qty, setQty] = useState("48");
  const [showChat, setShowChat] = useState(false);

  const params = useMemo(
    () => ({
      store_id: sessionUser.storeId,
    }),
    [],
  );

  const overviewQuery = useProductionOverviewQuery(params);
  const registrationFormQuery = useProductionRegistrationFormQuery(
    activeSku
      ? {
          store_id: sessionUser.storeId,
          sku_id: activeSku.sku_id,
        }
      : undefined,
  );

  const stats = overviewQuery.data?.summary_stats ?? [];
  const alerts = overviewQuery.data?.alerts ?? [];
  const items = overviewQuery.data?.items ?? [];

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
            form={registrationFormQuery.data}
            qty={qty}
            onChangeQty={setQty}
            onClose={() => setActiveSku(null)}
          />
        </AppModal>
      ) : null}
    </div>
  );
}
