import { useState } from "react";
import dayjs from "dayjs";
import { PAGE_CAPTIONS } from "@/commons/constants/field-captions";
import { FifoLotSection } from "@/features/production/components/FifoLotSection";
import { ProductionInventoryStatusSection } from "@/features/production/components/ProductionInventoryStatusSection";
import { useGetFifoLotSummaryQuery } from "@/features/production/queries/useGetFifoLotSummaryQuery";
import { useGetProductionInventoryStatusQuery } from "@/features/production/queries/useGetProductionInventoryStatusQuery";
import type {
  FifoLotType,
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

function buildFifoPeriodDescription(referenceDate: string) {
  const targetDate = dayjs(referenceDate);
  if (!targetDate.isValid()) {
    return "";
  }

  const monthStart = targetDate.startOf("month");
  const previousDay = targetDate.subtract(1, "day");
  const formattedReferenceDate = targetDate.format("YYYY-MM-DD");

  if (previousDay.isBefore(monthStart, "day")) {
    return `조회 기간 기준: ${formattedReferenceDate} 기준 당월 누적 대상이 없어 0건으로 표시됩니다.`;
  }

  return `조회 기간 기준: ${monthStart.format("YYYY-MM-DD")} ~ ${previousDay.format("YYYY-MM-DD")} (기준일 ${formattedReferenceDate} 전일까지 누적)`;
}

export function ProductionInventoryDiagnosisScreen() {
  const { user, referenceDateTime } = useDemoSession();
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
  const fifoReferenceDate = referenceDateTime.slice(0, 10);
  const fifoPeriodDescription = buildFifoPeriodDescription(fifoReferenceDate);
  const {
    data: inventoryData,
    isLoading: inventoryLoading,
    isError: inventoryError,
  } = useGetProductionInventoryStatusQuery(storeId, inventoryStatusFilters, inventoryPage, 10);
  const { data: fifoData, isLoading: fifoLoading } = useGetFifoLotSummaryQuery(
    storeId,
    fifoLotType,
    fifoPage,
    20,
    selectedFifoLotTypes.length > 0,
    fifoReferenceDate,
  );

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
          data={inventoryData}
          isLoading={inventoryLoading}
          selectedStatuses={selectedStatuses}
          onChangeStatuses={handleStatusesChange}
          onChangePage={setInventoryPage}
          isError={inventoryError}
          currentPage={inventoryPage}
        />
      </section>

      <div className="border-t border-[#DADADA]" />

      <FifoLotSection
        data={fifoData}
        isLoading={fifoLoading}
        selectedLotTypes={selectedFifoLotTypes}
        onChangeLotTypes={handleLotTypesChange}
        onChangePage={setFifoPage}
        currentPage={fifoPage}
        periodDescription={fifoPeriodDescription}
      />
    </div>
  );
}
