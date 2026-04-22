import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { AxiosError } from "axios";

import { PageHero } from "@/commons/components/page/page-layout";
import { formatCountWithUnit } from "@/commons/utils/format-count";
import { AnalyticsDateRangeFilter } from "@/features/analytics/components/AnalyticsDateRangeFilter";
import { AnalyticsMetricsGrid } from "@/features/analytics/components/AnalyticsMetricsGrid";
import { SalesTrendChart } from "@/features/analytics/components/SalesTrendChart";
import { getDefaultAnalyticsDateRange } from "@/features/analytics/constants/analytics-date-range";
import { useGetAnalyticsMetricsQuery } from "@/features/analytics/queries/useGetAnalyticsMetricsQuery";
import { useGetAnalyticsSalesTrendQuery } from "@/features/analytics/queries/useGetAnalyticsSalesTrendQuery";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";

export function AnalyticsScreen() {
  const { user } = useDemoSession();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultDateRange = useMemo(() => getDefaultAnalyticsDateRange(), []);
  const dateFrom = searchParams.get("date_from") ?? defaultDateRange.dateFrom;
  const dateTo = searchParams.get("date_to") ?? defaultDateRange.dateTo;

  const salesTrendQuery = useGetAnalyticsSalesTrendQuery(user.storeId);

  const metricsQuery = useGetAnalyticsMetricsQuery({
    store_id: user.storeId,
    date_from: dateFrom,
    date_to: dateTo,
  });

  const metrics = metricsQuery.data?.items ?? [];
  const metricsError = metricsQuery.error as AxiosError<{ detail?: string }> | null;
  const salesTrendError = salesTrendQuery.error as AxiosError<{ detail?: string }> | null;
  const errorMessages = [
    metricsError?.response?.data?.detail ??
      (metricsError ? "매출 지표 조회 중 오류가 발생했습니다." : null),
    salesTrendError?.response?.data?.detail ??
      (salesTrendError ? "매출 추이 조회 중 오류가 발생했습니다." : null),
  ].filter((message): message is string => Boolean(message));
  const uniqueErrorMessages = Array.from(new Set(errorMessages));

  const handleChangeDateFrom = useCallback(
    (value: string) => {
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.set("date_from", value);
      if (dateTo < value) {
        nextSearchParams.set("date_to", value);
      }
      setSearchParams(nextSearchParams, { replace: true });
    },
    [dateTo, searchParams, setSearchParams],
  );
  const handleChangeDateTo = useCallback(
    (value: string) => {
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.set("date_to", value);
      if (dateFrom > value) {
        nextSearchParams.set("date_from", value);
      }
      setSearchParams(nextSearchParams, { replace: true });
    },
    [dateFrom, searchParams, setSearchParams],
  );

  return (
    <div className="space-y-6">
      <PageHero
        title="매출 현황"
        description={`${dateFrom} ~ ${dateTo} 기준 주요 지표 ${formatCountWithUnit(metrics.length, "개")}를 확인합니다.`}
      />
      <AnalyticsDateRangeFilter
        dateFrom={dateFrom}
        dateTo={dateTo}
        onChangeDateFrom={handleChangeDateFrom}
        onChangeDateTo={handleChangeDateTo}
      />

      {uniqueErrorMessages.length > 0 ? (
        <section className="rounded-[22px] border border-red-200 bg-red-50 px-5 py-4 text-sm">
          <p className="font-semibold text-red-700">실데이터를 불러오지 못했습니다.</p>
          <div className="mt-1 space-y-1 text-red-600">
            {uniqueErrorMessages.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        </section>
      ) : null}

      <SalesTrendChart data={salesTrendQuery.data} isLoading={salesTrendQuery.isLoading} />

      <AnalyticsMetricsGrid metrics={metrics} />
    </div>
  );
}
