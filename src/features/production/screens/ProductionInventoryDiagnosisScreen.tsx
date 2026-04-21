import { useState } from "react";
import { CardAiButton } from "@/commons/components/chat/CardAiButton";
import { PageTitle } from "@/commons/components/page/PageTitle";
import { ProductionInventoryStatusSection } from "@/features/production/components/ProductionInventoryStatusSection";
import { useGetProductionInventoryStatusQuery } from "@/features/production/queries/useGetProductionInventoryStatusQuery";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";
import type { AxiosError } from "axios";

export function ProductionInventoryDiagnosisScreen() {
  const { user } = useDemoSession();
  const [page, setPage] = useState(1);

  const inventoryStatusQuery = useGetProductionInventoryStatusQuery(user.storeId ?? "");
  const apiError = inventoryStatusQuery.error as AxiosError<{ detail?: string }> | null;
  const errorMessage = apiError?.response?.data?.detail ?? null;

  return (
    <div className="space-y-6">
      <PageTitle
        title="재고 수준 진단"
        description="품목별 현재 재고와 판매량 비교를 통해 적정 재고 수준을 진단합니다."
      >
        <CardAiButton contextKey="production:inventory-status" />
      </PageTitle>
      <ProductionInventoryStatusSection
        data={inventoryStatusQuery.data}
        isLoading={inventoryStatusQuery.isLoading}
        onChangePage={setPage}
        errorMessage={errorMessage ?? undefined}
      />
    </div>
  );
}
