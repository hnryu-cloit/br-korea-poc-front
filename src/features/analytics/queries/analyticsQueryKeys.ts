import type { GetAuditLogsRequest } from "@/features/analytics/types/analytics";

const ANALYTICS_QUERY_ROOT = ["analytics"] as const;

export const analyticsQueryKeys = {
  all: ANALYTICS_QUERY_ROOT,
  metrics: () => [...ANALYTICS_QUERY_ROOT, "metrics"] as const,
  auditLogs: (params: GetAuditLogsRequest) =>
    [...ANALYTICS_QUERY_ROOT, "audit-logs", params] as const,
};
