import { useState } from "react";

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
  const { user } = useDemoSession();
  const [activeSku, setActiveSku] = useState<ProductionSkuItem | null>(null);
  const [activeSkuId, setActiveSkuId] = useState<string | null>(null);
  const [qty, setQty] = useState("48");
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
        title="상품별 생산 현황"
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
