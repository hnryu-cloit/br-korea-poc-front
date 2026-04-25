import type {
  GetAnalyticsMetricsRequest,
  GetAnalyticsSalesTrendRequest,
  GetAuditLogsRequest,
  GetMarketIntelligenceRequest,
} from "@/features/analytics/types/analytics";

const ANALYTICS_QUERY_ROOT = ["analytics"] as const;

export const analyticsQueryKeys = {
  all: ANALYTICS_QUERY_ROOT,
  metrics: (params?: GetAnalyticsMetricsRequest) =>
    [...ANALYTICS_QUERY_ROOT, "metrics", params ?? {}] as const,
  auditLogs: (params: GetAuditLogsRequest) =>
    [...ANALYTICS_QUERY_ROOT, "audit-logs", params] as const,
  storeProfile: (storeId: string) => [...ANALYTICS_QUERY_ROOT, "store-profile", storeId] as const,
  customerProfile: (storeId: string) =>
    [...ANALYTICS_QUERY_ROOT, "customer-profile", storeId] as const,
  salesTrend: (params?: GetAnalyticsSalesTrendRequest) =>
    [...ANALYTICS_QUERY_ROOT, "sales-trend", params ?? {}] as const,
  marketIntelligence: (params?: GetMarketIntelligenceRequest) =>
    [...ANALYTICS_QUERY_ROOT, "market-intelligence", params ?? {}] as const,
  marketInsights: (params?: GetMarketIntelligenceRequest) =>
    [...ANALYTICS_QUERY_ROOT, "market-insights", params ?? {}] as const,
  hqMarketInsights: (params?: GetMarketIntelligenceRequest & { limit?: number }) =>
    [...ANALYTICS_QUERY_ROOT, "hq-market-insights", params ?? {}] as const,
  marketScopeOptions: () => [...ANALYTICS_QUERY_ROOT, "market-scope-options"] as const,
};
