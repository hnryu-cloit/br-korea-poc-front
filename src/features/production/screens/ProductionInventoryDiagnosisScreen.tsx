import { useState } from "react";

import type { AxiosError } from "axios";

import { PAGE_CAPTIONS } from "@/commons/constants/field-captions";
import { FifoLotSection } from "@/features/production/components/FifoLotSection";
import { ProductionInventoryStatusSection } from "@/features/production/components/ProductionInventoryStatusSection";
import { useGetFifoLotSummaryQuery } from "@/features/production/queries/useGetFifoLotSummaryQuery";
import { useGetProductionInventoryStatusQuery } from "@/features/production/queries/useGetProductionInventoryStatusQuery";
import type { FifoLotType } from "@/features/production/types/production";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";

export function ProductionInventoryDiagnosisScreen() {
  const { user } = useDemoSession();
  const storeId = user.storeId ?? "";

  const [inventoryPage, setInventoryPage] = useState(1);
  const [fifoPage, setFifoPage] = useState(1);
  const [fifoLotType, setFifoLotType] = useState<FifoLotType>(undefined);

  const inventoryStatusQuery = useGetProductionInventoryStatusQuery(storeId, inventoryPage, 10);
  const fifoQuery = useGetFifoLotSummaryQuery(storeId, fifoLotType, fifoPage, 20);

  const apiError = inventoryStatusQuery.error as AxiosError<{ detail?: string }> | null;
  const errorMessage = apiError?.response?.data?.detail ?? null;

  const handleLotTypeChange = (type: FifoLotType) => {
    setFifoLotType(type);
    setFifoPage(1);
  };

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <div>
          <h2 className="text-[#41352E] text-[24px] font-bold">현재 재고 현황</h2>
          <p className="mt-1 text-sm text-slate-500">
            {PAGE_CAPTIONS["production:inventory"].subtitle}
          </p>
        </div>
        <ProductionInventoryStatusSection
          data={inventoryStatusQuery.data}
          isLoading={inventoryStatusQuery.isLoading}
          onChangePage={setInventoryPage}
          errorMessage={errorMessage ?? undefined}
        />
      </section>

      <div className="border-t border-[#DADADA]" />

      <FifoLotSection
        data={fifoQuery.data}
        isLoading={fifoQuery.isLoading}
        lotType={fifoLotType}
        onChangeLotType={handleLotTypeChange}
        onChangePage={setFifoPage}
      />
    </div>
  );
}
