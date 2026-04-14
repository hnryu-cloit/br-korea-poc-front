import axiosInstance from "@/services/axiosInstance";

import type { AnalyticsMetricsResponse, AuditLogListResponse } from "@/features/analytics/types/analytics";

export async function getAnalyticsMetrics() {
  const response = await axiosInstance.get<AnalyticsMetricsResponse>("/api/analytics/metrics");
  return response.data;
}

export async function getAuditLogs(domain?: string, limit = 50) {
  const response = await axiosInstance.get<AuditLogListResponse>("/api/audit/logs", {
    params: {
      domain,
      limit,
    },
  });
  return response.data;
}
