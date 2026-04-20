import { useState } from "react";
import { useLocation } from "react-router-dom";

import { AppModal } from "@/commons/components/modal/AppModal";
import { ProductionHero } from "@/features/production/components/ProductionHero";
import { ProductionRegistrationPanel } from "@/features/production/components/ProductionRegistrationPanel";
import { ProductionTableSection } from "@/features/production/components/ProductionTableSection";
import { useGetProductionSkuDetailQuery } from "@/features/production/queries/useGetProductionSkuDetailQuery";
import { useGetProductionSkuListQuery } from "@/features/production/queries/useGetProductionSkuListQuery";
import { usePostProductionRegistrationMutation } from "@/features/production/queries/usePostProductionRegistrationMutation";
import type { ProductionSkuItem } from "@/features/production/types/production";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";

export function ProductionStatusScreen() {
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
  const [activeSku, setActiveSku] = useState<ProductionSkuItem | null>(null);
  const [activeSkuId, setActiveSkuId] = useState<string | null>(null);
  const [qty, setQty] = useState("48");
  const [showChat, setShowChat] = useState(fromDashboardProduction);
  const [page, setPage] = useState(1);

  const skuListQuery = useGetProductionSkuListQuery({
    page,
    page_size: 10,
    store_id: user.storeId,
  });
  const skuDetailQuery = useGetProductionSkuDetailQuery(activeSkuId, user.storeId);
  const postRegistrationMutation = usePostProductionRegistrationMutation();

  const items = skuListQuery.data?.items ?? [];

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
        showChat={showChat}
        onToggleChat={() => setShowChat((value) => !value)}
        title="상품별 생산 현황"
        // description="5분 단위 자동 갱신 재고와 1시간 후 예측, 4주 평균 생산 패턴을 기준으로 생산 필요 시점을 자동 감지합니다."
        description=""
      />
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
