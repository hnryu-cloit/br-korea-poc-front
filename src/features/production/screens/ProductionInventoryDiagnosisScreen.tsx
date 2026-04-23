import { ProductionInventoryStatusSection } from "@/features/production/components/ProductionInventoryStatusSection";
import { useGetProductionInventoryStatusQuery } from "@/features/production/queries/useGetProductionInventoryStatusQuery";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";
import type { AxiosError } from "axios";
import { useState } from "react";

export function ProductionInventoryDiagnosisScreen() {
  const { user } = useDemoSession();
  const [page, setPage] = useState(1);

  const inventoryStatusQuery = useGetProductionInventoryStatusQuery(user.storeId ?? "", page, 10);
  const apiError = inventoryStatusQuery.error as AxiosError<{ detail?: string }> | null;
  const errorMessage = apiError?.response?.data?.detail ?? null;

  return (
    <div className="space-y-6">
      <h2 className="text-[#41352E] text-[24px] font-bold mb-8">현재 재고 현황</h2>

      <ProductionInventoryStatusSection
        data={inventoryStatusQuery.data}
        isLoading={inventoryStatusQuery.isLoading}
        onChangePage={setPage}
        errorMessage={errorMessage ?? undefined}
      />
    </div>
  );
}
