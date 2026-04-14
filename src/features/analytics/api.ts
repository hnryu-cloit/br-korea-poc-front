import axiosInstance from "@/services/axiosInstance";

import type { AnalyticsMetricsResponse, AuditLogListResponse } from "@/features/analytics/type/analytics";

export async function fetchAnalyticsMetrics() {
  const response = await axiosInstance.get<AnalyticsMetricsResponse>("/api/analytics/metrics");
  return response.data;
}

export async function fetchAuditLogs(domain?: string, limit = 50) {
  const response = await axiosInstance.get<AuditLogListResponse>("/api/audit/logs", {
    params: {
      domain,
      limit,
    },
  });
  return response.data;
}
