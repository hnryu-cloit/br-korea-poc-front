import type {
  GetSalesCostBreakdownRequest,
  GetSalesInsightsRequest,
  GetSalesProductProfitabilityRequest,
  GetSalesProfitTrendRequest,
  GetSalesSummaryRequest,
} from "@/features/sales/types/sales";

const SALES_QUERY_ROOT = ["sales"] as const;

export const salesQueryKeys = {
  all: SALES_QUERY_ROOT,
  summary: (params: GetSalesSummaryRequest) =>
    [...SALES_QUERY_ROOT, "summary", params] as const,
  profitTrend: (params: GetSalesProfitTrendRequest) =>
    [...SALES_QUERY_ROOT, "profit-trend", params] as const,
  costBreakdown: (params: GetSalesCostBreakdownRequest) =>
    [...SALES_QUERY_ROOT, "cost-breakdown", params] as const,
  productProfitability: (params: GetSalesProductProfitabilityRequest) =>
    [...SALES_QUERY_ROOT, "product-profitability", params] as const,
  prompts: () => [...SALES_QUERY_ROOT, "prompts"] as const,
  insights: (params?: GetSalesInsightsRequest) =>
    [...SALES_QUERY_ROOT, "insights", params ?? {}] as const,
};
