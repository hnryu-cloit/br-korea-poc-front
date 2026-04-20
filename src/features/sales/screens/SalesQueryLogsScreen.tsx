import { useMemo, useState } from "react";

import { PageHero } from "@/commons/components/page/page-layout";
import { formatCountWithUnit } from "@/commons/utils/format-count";
import { AnalyticsQueryLogSection } from "@/features/analytics/components/AnalyticsQueryLogSection";
import { useGetAuditLogsQuery } from "@/features/analytics/queries/useGetAuditLogsQuery";
import type { AuditLogEntry } from "@/features/analytics/types/analytics";
import type { QueryCategory } from "@/features/analytics/types/analytics-screen";
import {
  calculateLogStats,
  filterLogsByCategory,
} from "@/features/analytics/utils/analytics-screen";

export function SalesQueryLogsScreen() {
  const [activeCategory, setActiveCategory] = useState<QueryCategory>("전체");

  const logsQuery = useGetAuditLogsQuery({ domain: "sales", limit: 20 });
  const allLogs: AuditLogEntry[] = useMemo(() => logsQuery.data?.items ?? [], [logsQuery.data?.items]);
  const filteredLogs = useMemo(
    () => filterLogsByCategory(allLogs, activeCategory),
    [activeCategory, allLogs],
  );
  const { sqlPct, blockedCount } = useMemo(() => calculateLogStats(allLogs), [allLogs]);

  return (
    <div className="space-y-6">
      <PageHero
        title="질의 처리 로그"
        description={`매출 현황 화면과 동일한 로그 ${formatCountWithUnit(allLogs.length, "건")}을 조회합니다.`}
      />
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
