import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { PageHero } from "@/commons/components/page/page-layout";
import { formatCountWithUnit } from "@/commons/utils/format-count";
import { AnalyticsDateRangeFilter } from "@/features/analytics/components/AnalyticsDateRangeFilter";
import { AnalyticsMetricsGrid } from "@/features/analytics/components/AnalyticsMetricsGrid";
import { SalesTrendChart } from "@/features/analytics/components/SalesTrendChart";
import { getDefaultAnalyticsDateRange } from "@/features/analytics/constants/analytics-date-range";
import { useGetAnalyticsMetricsQuery } from "@/features/analytics/queries/useGetAnalyticsMetricsQuery";
import { useGetAnalyticsSalesTrendQuery } from "@/features/analytics/queries/useGetAnalyticsSalesTrendQuery";
import { useGetAuditLogsQuery } from "@/features/analytics/queries/useGetAuditLogsQuery";
import type { AuditLogEntry } from "@/features/analytics/types/analytics";
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

  const logsQuery = useGetAuditLogsQuery({ domain: "sales", limit: 20 });

  const allLogs: AuditLogEntry[] = logsQuery.data?.items ?? [];
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
        description={`${dateFrom} ~ ${dateTo} 기준 주요 지표 ${formatCountWithUnit(metrics.length, "개")}와 질의 처리 로그 ${formatCountWithUnit(allLogs.length, "건")}을 확인합니다.`}
      />
      <AnalyticsDateRangeFilter
        dateFrom={dateFrom}
        dateTo={dateTo}
        onChangeDateFrom={handleChangeDateFrom}
        onChangeDateTo={handleChangeDateTo}
      />

      <SalesTrendChart data={salesTrendQuery.data} isLoading={salesTrendQuery.isLoading} />

      <AnalyticsMetricsGrid metrics={metrics} />
    </div>
  );
}
