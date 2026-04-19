import axiosInstance from "@/services/axiosInstance";

import type {
  AnalyticsMetricsResponse,
  AuditLogListResponse,
  CustomerProfileResponse,
  GetAnalyticsMetricsRequest,
  SalesTrendResponse,
  StoreProfileResponse,
} from "@/features/analytics/types/analytics";

export async function getAnalyticsMetrics(params?: GetAnalyticsMetricsRequest) {
  const response = await axiosInstance.get<AnalyticsMetricsResponse>("/api/analytics/metrics", {
    params,
  });
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

export async function getAnalyticsStoreProfile(storeId: string) {
  const response = await axiosInstance.get<StoreProfileResponse>("/api/analytics/store-profile", {
    params: { store_id: storeId },
  });
  return response.data;
}

export async function getAnalyticsCustomerProfile(storeId: string) {
  const response = await axiosInstance.get<CustomerProfileResponse>("/api/analytics/customer-profile", {
    params: { store_id: storeId },
  });
  return response.data;
}

export async function getAnalyticsSalesTrend(storeId?: string) {
  const response = await axiosInstance.get<SalesTrendResponse>("/api/analytics/sales-trend", {
    params: storeId ? { store_id: storeId } : undefined,
  });
  return response.data;
}
