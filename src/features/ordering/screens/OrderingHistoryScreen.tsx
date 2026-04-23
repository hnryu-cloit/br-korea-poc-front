import { useMemo, useState } from "react";
import type { AxiosError } from "axios";

import { StatsGrid } from "@/commons/components/page/page-layout";
import type { HighlightStat } from "@/commons/constants/page-content";
import { formatCountWithUnit } from "@/commons/utils/format-count";
import { OrderingHero } from "@/features/ordering/components/OrderingHero";
import { OrderingHistoryChartsSection } from "@/features/ordering/components/OrderingHistoryChartsSection";
import { OrderingHistoryFilterSection } from "@/features/ordering/components/OrderingHistoryFilterSection";
import { OrderingHistoryInsightsSection } from "@/features/ordering/components/OrderingHistoryInsightsSection";
import { OrderingHistorySection } from "@/features/ordering/components/OrderingHistorySection";
import { useGetOrderingHistoryQuery } from "@/features/ordering/queries/useGetOrderingHistoryQuery";
import { useGetOrderingHistoryInsightsQuery } from "@/features/ordering/queries/useGetOrderingHistoryInsightsQuery";
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
  const [dateFrom, setDateFrom] = useState(defaultFrom);
  const [dateTo, setDateTo] = useState(defaultTo);
  const [itemName, setItemName] = useState("");
  const [orderType, setOrderType] = useState<"all" | "auto" | "manual">("all");

  const historyParams = useMemo(
    () => ({
      store_id: user.storeId,
      limit: 100,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
      item_nm: itemName || undefined,
      is_auto: orderType === "all" ? undefined : orderType === "auto",
    }),
    [user.storeId, dateFrom, dateTo, itemName, orderType],
  );

  const historyQuery = useGetOrderingHistoryQuery(historyParams);
  const insightsQuery = useGetOrderingHistoryInsightsQuery(historyParams);
  const historyError = historyQuery.error as AxiosError<{ detail?: string }> | null;
  const insightsError = insightsQuery.error as AxiosError<{ detail?: string }> | null;
  const errorMessage =
    historyError?.response?.data?.detail ?? insightsError?.response?.data?.detail ?? null;

  const orderingHistoryStats: HighlightStat[] = [
    {
      label: "총 발주 건수",
      value: historyQuery.data ? formatCountWithUnit(historyQuery.data.total_count, "건") : "-",
      tone: "primary" as const,
    },
    {
      label: "자동 발주 비중",
      value: historyQuery.data ? `${Math.round(historyQuery.data.auto_rate * 100)}%` : "-",
      tone: "success" as const,
    },
    {
      label: "수동 발주 비중",
      value: historyQuery.data ? `${Math.round(historyQuery.data.manual_rate * 100)}%` : "-",
      tone: "default" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <OrderingHero />
      {errorMessage ? (
        <section className="rounded-[16px] border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
          발주 이력 조회 오류: {errorMessage}
        </section>
      ) : null}
      <OrderingHistoryFilterSection
        dateFrom={dateFrom}
        dateTo={dateTo}
        itemName={itemName}
        orderType={orderType}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onItemNameChange={setItemName}
        onOrderTypeChange={setOrderType}
      />
      <StatsGrid stats={orderingHistoryStats} />
      <OrderingHistoryChartsSection
        items={historyQuery.data?.items ?? []}
        topChangedItems={insightsQuery.data?.top_changed_items ?? []}
        isLoading={historyQuery.isLoading || insightsQuery.isLoading}
      />
      <OrderingHistoryInsightsSection
        data={insightsQuery.data}
        isLoading={insightsQuery.isLoading}
      />
      <OrderingHistorySection data={historyQuery.data} isLoading={historyQuery.isLoading} />
    </div>
  );
}
