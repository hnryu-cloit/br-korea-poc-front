import { useState } from "react";

import { PageHero } from "@/commons/components/page/page-layout";
import { formatCountWithUnit } from "@/commons/utils/format-count";
import { AnalyticsMetricsGrid } from "@/features/analytics/components/AnalyticsMetricsGrid";
import { AnalyticsQueryLogSection } from "@/features/analytics/components/AnalyticsQueryLogSection";
import { useGetAnalyticsMetricsQuery } from "@/features/analytics/queries/useGetAnalyticsMetricsQuery";
import { useGetAuditLogsQuery } from "@/features/analytics/queries/useGetAuditLogsQuery";
import type { AuditLogEntry } from "@/features/analytics/types/analytics";
import type { QueryCategory } from "@/features/analytics/types/analytics-screen";
import {
  calculateLogStats,
  filterLogsByCategory,
} from "@/features/analytics/utils/analytics-screen";

export function AnalyticsScreen() {
  const [activeCategory, setActiveCategory] = useState<QueryCategory>("전체");

  const metricsQuery = useGetAnalyticsMetricsQuery();

  const metrics = metricsQuery.data?.items ?? [];

  const logsQuery = useGetAuditLogsQuery({ domain: "sales", limit: 20 });

  const allLogs: AuditLogEntry[] = logsQuery.data?.items ?? [];
  const filteredLogs = filterLogsByCategory(allLogs, activeCategory);
  const { sqlPct, blockedCount } = calculateLogStats(allLogs);

  return (
    <div className="space-y-6">
      <PageHero
        title="매출 현황"
        description={`주요 지표 ${formatCountWithUnit(metrics.length, "개")}와 질의 처리 로그 ${formatCountWithUnit(allLogs.length, "건")}을 확인합니다.`}
      />

      <AnalyticsMetricsGrid metrics={metrics} />

      <AnalyticsQueryLogSection
        activeCategory={activeCategory}
        onChangeCategory={setActiveCategory}
        logs={filteredLogs}
        allLogsCount={allLogs.length}
        sqlPct={sqlPct}
        blockedCount={blockedCount}
        isLoading={logsQuery.isLoading}
      />
    </div>
  );
}
