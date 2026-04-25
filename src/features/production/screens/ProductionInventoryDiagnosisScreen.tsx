import { useState } from "react";

import type { AxiosError } from "axios";

import { PAGE_CAPTIONS } from "@/commons/constants/field-captions";
import { FifoLotSection } from "@/features/production/components/FifoLotSection";
import { ProductionInventoryStatusSection } from "@/features/production/components/ProductionInventoryStatusSection";
import { useGetFifoLotSummaryQuery } from "@/features/production/queries/useGetFifoLotSummaryQuery";
import { useGetProductionInventoryStatusQuery } from "@/features/production/queries/useGetProductionInventoryStatusQuery";
import type { FifoLotType } from "@/features/production/types/production";
import type {
  InventoryStatusFilterCode,
  InventoryStatusItem,
} from "@/features/production/types/production";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";

const INVENTORY_STATUS_FILTERS: InventoryStatusItem["status"][] = ["여유", "부족", "적정"];
const INVENTORY_STATUS_CODE_MAP: Record<InventoryStatusItem["status"], InventoryStatusFilterCode> =
  {
    여유: "excess",
    부족: "shortage",
    적정: "normal",
  };
const FIFO_LOT_FILTERS: Exclude<FifoLotType, undefined>[] = ["production", "delivery"];

export function ProductionInventoryDiagnosisScreen() {
  const { user } = useDemoSession();
  const storeId = user.storeId ?? "";

  const [inventoryPage, setInventoryPage] = useState(1);
  const [fifoPage, setFifoPage] = useState(1);
  const [selectedFifoLotTypes, setSelectedFifoLotTypes] =
    useState<Exclude<FifoLotType, undefined>[]>(FIFO_LOT_FILTERS);
  const [selectedStatuses, setSelectedStatuses] =
    useState<InventoryStatusItem["status"][]>(INVENTORY_STATUS_FILTERS);

  const inventoryStatusFilters = selectedStatuses.map(
    (status) => INVENTORY_STATUS_CODE_MAP[status],
  );
  const fifoLotType = selectedFifoLotTypes.length === 1 ? selectedFifoLotTypes[0] : undefined;
  const today = new Date().toISOString().slice(0, 10);
  const inventoryStatusQuery = useGetProductionInventoryStatusQuery(
    storeId,
    inventoryStatusFilters,
    inventoryPage,
    10,
  );
  const fifoQuery = useGetFifoLotSummaryQuery(
    storeId,
    fifoLotType,
    fifoPage,
    20,
    selectedFifoLotTypes.length > 0,
    today,
  );

  const apiError = inventoryStatusQuery.error as AxiosError<{ detail?: string }> | null;
  const errorMessage = apiError?.response?.data?.detail ?? null;

  const handleLotTypesChange = (types: Exclude<FifoLotType, undefined>[]) => {
    setSelectedFifoLotTypes(types);
    setFifoPage(1);
  };

  const handleStatusesChange = (statuses: InventoryStatusItem["status"][]) => {
    setSelectedStatuses(statuses);
    setInventoryPage(1);
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
          selectedStatuses={selectedStatuses}
          onChangeStatuses={handleStatusesChange}
          onChangePage={setInventoryPage}
          errorMessage={errorMessage ?? undefined}
        />
      </section>

      <div className="border-t border-[#DADADA]" />

      <FifoLotSection
        data={selectedFifoLotTypes.length > 0 ? fifoQuery.data : undefined}
        isLoading={selectedFifoLotTypes.length > 0 && fifoQuery.isLoading}
        selectedLotTypes={selectedFifoLotTypes}
        onChangeLotTypes={handleLotTypesChange}
        onChangePage={setFifoPage}
      />
    </div>
  );
}
