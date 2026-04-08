import { axiosInstance } from "@/services/axiosInstance";

import type { AnalyticsMetricsResponse, AuditLogListResponse } from "@/features/analytics/types";

export function fetchAnalyticsMetrics() {
  return axiosInstance.get<AnalyticsMetricsResponse>("/api/analytics/metrics");
}

export function fetchAuditLogs(domain?: string, limit = 50) {
  return axiosInstance.get<AuditLogListResponse>("/api/audit/logs", {
    params: {
      domain,
      limit,
    },
  });
}
