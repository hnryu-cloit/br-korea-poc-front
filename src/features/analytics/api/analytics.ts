import axiosInstance from "@/services/axiosInstance";

import type {
  AnalyticsMetricsResponse,
  AuditLogListResponse,
  CustomerProfileResponse,
  GetAnalyticsMetricsRequest,
  GetAnalyticsSalesTrendRequest,
  GetMarketIntelligenceRequest,
  HQMarketInsightsResponse,
  MarketIntelligenceResponse,
  MarketInsightsResponse,
  MarketScopeOptionsResponse,
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
  const response = await axiosInstance.get<CustomerProfileResponse>(
    "/api/analytics/customer-profile",
    {
      params: { store_id: storeId },
    },
  );
  return response.data;
}

export async function getAnalyticsSalesTrend(params?: GetAnalyticsSalesTrendRequest) {
  const response = await axiosInstance.get<SalesTrendResponse>("/api/analytics/sales-trend", {
    params,
  });
  return response.data;
}

export async function getAnalyticsMarketIntelligence(params?: GetMarketIntelligenceRequest) {
  const response = await axiosInstance.get<MarketIntelligenceResponse>(
    "/api/analytics/market-intelligence",
    {
      params,
    },
  );
  return response.data;
}

export async function getAnalyticsMarketInsights(params?: GetMarketIntelligenceRequest) {
  const response = await axiosInstance.get<MarketInsightsResponse>(
    "/api/analytics/market-intelligence/insights",
    {
      params,
    },
  );
  return response.data;
}

export async function getHqAnalyticsMarketInsights(
  params?: GetMarketIntelligenceRequest & { limit?: number },
) {
  const response = await axiosInstance.get<HQMarketInsightsResponse>(
    "/api/analytics/market-intelligence/insights/hq",
    {
      params,
    },
  );
  return response.data;
}

export async function getAnalyticsWeeklyReport(params?: GetMarketIntelligenceRequest): Promise<{
  blob: Blob;
  filename: string;
}> {
  const response = await axiosInstance.get<Blob>(
    "/api/analytics/market-intelligence/weekly-report",
    {
      params: {
        ...params,
        format: "pdf",
      },
      responseType: "blob",
    },
  );
  const disposition = response.headers["content-disposition"] as string | undefined;
  const matched = disposition?.match(/filename="?([^"]+)"?/i);
  const filename = matched?.[1] ?? "weekly_market_report.pdf";
  return { blob: response.data, filename };
}

export async function getAnalyticsMarketScopeOptions() {
  const response = await axiosInstance.get<MarketScopeOptionsResponse>(
    "/api/analytics/market-scope-options",
  );
  return response.data;
}
