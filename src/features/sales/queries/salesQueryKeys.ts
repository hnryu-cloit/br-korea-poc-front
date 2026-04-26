import type {
  GetSalesCostBreakdownRequest,
  GetSalesInsightsRequest,
  GetSalesPromptsRequest,
  GetSalesProductProfitabilityRequest,
  GetSalesProfitTrendRequest,
} from "@/features/sales/types/sales";

const SALES_QUERY_ROOT = ["sales"] as const;

export const salesQueryKeys = {
  all: SALES_QUERY_ROOT,
  summary: (params?: GetSalesInsightsRequest) =>
    [...SALES_QUERY_ROOT, "summary", params ?? {}] as const,
  profitTrend: (params: GetSalesProfitTrendRequest) =>
    [...SALES_QUERY_ROOT, "profit-trend", params] as const,
  costBreakdown: (params: GetSalesCostBreakdownRequest) =>
    [...SALES_QUERY_ROOT, "cost-breakdown", params] as const,
  productProfitability: (params: GetSalesProductProfitabilityRequest) =>
    [...SALES_QUERY_ROOT, "product-profitability", params] as const,
  prompts: (params?: GetSalesPromptsRequest) =>
    [...SALES_QUERY_ROOT, "prompts", params ?? {}] as const,
  insights: (params?: GetSalesInsightsRequest) =>
    [...SALES_QUERY_ROOT, "insights", params ?? {}] as const,
  menuInsights: (params?: GetSalesInsightsRequest) =>
    [...SALES_QUERY_ROOT, "menu-insights", params ?? {}] as const,
  campaignEffect: (params?: GetSalesInsightsRequest) =>
    [...SALES_QUERY_ROOT, "campaign-effect", params ?? {}] as const,
  hourlyChannel: (params?: GetSalesInsightsRequest) =>
    [...SALES_QUERY_ROOT, "hourly-channel", params ?? {}] as const,
  benchmark: (storeId?: string) => [...SALES_QUERY_ROOT, "benchmark", storeId ?? "all"] as const,
};
