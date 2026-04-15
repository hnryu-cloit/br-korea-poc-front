import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { PageHero } from "@/commons/components/page/page-layout";
import { AnalyticsMetricsGrid } from "@/features/analytics/components/AnalyticsMetricsGrid";
import { AnalyticsQueryLogSection } from "@/features/analytics/components/AnalyticsQueryLogSection";
import { getAuditLogs, getAnalyticsMetrics } from "@/features/analytics/api/analytics";
import type { AuditLogEntry } from "@/features/analytics/types/analytics";
import type { QueryCategory } from "@/features/analytics/types/analytics-screen";
import {
  calculateLogStats,
  filterLogsByCategory,
} from "@/features/analytics/utils/analytics-screen";

export function AnalyticsScreen() {
  const [activeCategory, setActiveCategory] = useState<QueryCategory>("전체");

  const metricsQuery = useQuery({
    queryKey: ["analytics-metrics"],
    queryFn: getAnalyticsMetrics,
    refetchInterval: 15_000,
  });

  const metrics = metricsQuery.data?.items ?? [];

  const logsQuery = useQuery({
    queryKey: ["audit-logs-sales"],
    queryFn: () => getAuditLogs("sales", 20),
    refetchInterval: 15_000,
  });

  const allLogs: AuditLogEntry[] = logsQuery.data?.items ?? [];
  const filteredLogs = filterLogsByCategory(allLogs, activeCategory);
  const { sqlPct, blockedCount } = calculateLogStats(allLogs);

  return (
    <div className="space-y-6">
      <PageHero
        title="매출 현황"
        description={`주요 지표 ${metrics.length}개와 질의 처리 로그 ${allLogs.length}건을 확인합니다.`}
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
