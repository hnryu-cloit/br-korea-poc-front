import { useMemo, useState } from "react";

import { OrderingHistoryChartsSection } from "@/features/ordering/components/OrderingHistoryChartsSection";
import { OrderingHistoryFilterSection } from "@/features/ordering/components/OrderingHistoryFilterSection";
import { OrderingHistoryInsightsSection } from "@/features/ordering/components/OrderingHistoryInsightsSection";
import { OrderingHistorySection } from "@/features/ordering/components/OrderingHistorySection";
import { useGetOrderingHistoryInsightsQuery } from "@/features/ordering/queries/useGetOrderingHistoryInsightsQuery";
import { useGetOrderingHistoryQuery } from "@/features/ordering/queries/useGetOrderingHistoryQuery";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";

function defaultDateRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - 89);
  const fmt = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  return { from: fmt(from), to: fmt(to) };
}

export function OrderingHistoryScreen() {
  const { user } = useDemoSession();
  const { from: defaultFrom, to: defaultTo } = defaultDateRange();
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFrom, setDateFrom] = useState(defaultFrom);
  const [dateTo, setDateTo] = useState(defaultTo);
  const [itemName, setItemName] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    dateFrom: defaultFrom,
    dateTo: defaultTo,
    itemName: "",
  });

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
      <h2 className="text-[#41352E] text-[24px] font-bold mb-8">발주 이력</h2>
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
