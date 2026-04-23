import { useState } from "react";
import { ProductionWasteSection } from "@/features/production/components/ProductionWasteSection";
import { useGetProductionWasteQuery } from "@/features/production/queries/useGetProductionWasteQuery";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";
import type { AxiosError } from "axios";
import { ProductWasteSummary } from "../components/ProductWasteSummary";

export function ProductionWasteLossScreen() {
  const { user } = useDemoSession();
  const [page, setPage] = useState(1);

  const wasteQuery = useGetProductionWasteQuery(user.storeId ?? "", page, 10);
  const apiError = wasteQuery.error as AxiosError<{ detail?: string }> | null;
  const errorMessage = apiError?.response?.data?.detail ?? null;

  return (
    <div className="space-y-6">
      <h2 className="text-[#41352E] text-[24px] font-bold mb-8">폐기 손실 현황</h2>
      <ProductWasteSummary
        totalDisuseAmount={wasteQuery.data?.total_disuse_amount}
        montlyTopItems={wasteQuery.data?.monthly_top_items}
      />
      <ProductionWasteSection
        data={wasteQuery.data}
        isLoading={wasteQuery.isLoading}
        onChangePage={setPage}
        errorMessage={errorMessage ?? undefined}
      />
    </div>
  );
}
