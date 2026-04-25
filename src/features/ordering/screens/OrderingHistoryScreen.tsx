import { useEffect, useMemo, useState } from "react";

import { PAGE_CAPTIONS } from "@/commons/constants/field-captions";
import { OrderingHistoryChartsSection } from "@/features/ordering/components/OrderingHistoryChartsSection";
import { OrderingHistoryFilterSection } from "@/features/ordering/components/OrderingHistoryFilterSection";
import { OrderingHistoryInsightsSection } from "@/features/ordering/components/OrderingHistoryInsightsSection";
import { OrderingHistorySection } from "@/features/ordering/components/OrderingHistorySection";
import { useGetOrderingHistoryInsightsQuery } from "@/features/ordering/queries/useGetOrderingHistoryInsightsQuery";
import { useGetOrderingHistoryQuery } from "@/features/ordering/queries/useGetOrderingHistoryQuery";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";
import { getDateRange } from "@/commons/utils/getDateRange";

export function OrderingHistoryScreen() {
  const { user, referenceDateTime } = useDemoSession();
  const { from: defaultFrom, to: defaultTo } = useMemo(
    () => getDateRange(referenceDateTime),
    [referenceDateTime],
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFrom, setDateFrom] = useState(defaultFrom);
  const [dateTo, setDateTo] = useState(defaultTo);
  const [itemName, setItemName] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    dateFrom: defaultFrom,
    dateTo: defaultTo,
    itemName: "",
  });

  useEffect(() => {
    setCurrentPage(1);
    setDateFrom(defaultFrom);
    setDateTo(defaultTo);
    setAppliedFilters((current) => ({
      ...current,
      dateFrom: defaultFrom,
      dateTo: defaultTo,
    }));
  }, [defaultFrom, defaultTo]);

  const historyParams = useMemo(
    () => ({
      store_id: user.storeId,
      page: currentPage,
      page_size: 10,
      date_from: appliedFilters.dateFrom || undefined,
      date_to: appliedFilters.dateTo || undefined,
      item_nm: appliedFilters.itemName || undefined,
    }),
    [user.storeId, appliedFilters, currentPage],
  );

  const historyChartParams = useMemo(
    () => ({
      store_id: user.storeId,
      page: 1,
      page_size: 100,
      date_from: appliedFilters.dateFrom || undefined,
      date_to: appliedFilters.dateTo || undefined,
      item_nm: appliedFilters.itemName || undefined,
    }),
    [user.storeId, appliedFilters],
  );

  const insightsParams = useMemo(
    () => ({
      store_id: user.storeId,
      limit: 200,
      date_from: appliedFilters.dateFrom || undefined,
      date_to: appliedFilters.dateTo || undefined,
      item_nm: appliedFilters.itemName || undefined,
    }),
    [user.storeId, appliedFilters],
  );

  const historyQuery = useGetOrderingHistoryQuery(historyParams);
  const historyChartQuery = useGetOrderingHistoryQuery(historyChartParams);
  const insightsQuery = useGetOrderingHistoryInsightsQuery(insightsParams);

  const onConfirm = () => {
    setCurrentPage(1);
    setAppliedFilters({
      dateFrom,
      dateTo,
      itemName,
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-[#41352E] text-[24px] font-bold">발주 이력</h2>
        <p className="mt-1 text-sm text-slate-500">{PAGE_CAPTIONS["ordering:history"].subtitle}</p>
      </div>
      <OrderingHistoryFilterSection
        dateFrom={dateFrom}
        dateTo={dateTo}
        itemName={itemName}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onItemNameChange={setItemName}
        onConfirm={onConfirm}
      />
      <OrderingHistoryChartsSection
        items={historyChartQuery.data?.items ?? []}
        topChangedItems={insightsQuery.data?.top_changed_items ?? []}
        isLoading={historyChartQuery.isLoading || insightsQuery.isLoading}
      />
      <OrderingHistoryInsightsSection
        data={insightsQuery.data}
        isLoading={insightsQuery.isLoading}
      />
      <OrderingHistorySection
        data={historyQuery.data}
        isLoading={historyQuery.isLoading}
        currentPage={currentPage}
        onChangePage={setCurrentPage}
      />
    </div>
  );
}
