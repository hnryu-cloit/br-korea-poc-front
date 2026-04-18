import type {
  SalesPrompt,
  SalesQueryResponse,
  SalesSummaryResponse,
} from "@/features/sales/types/sales";
import type {
  SalesProductDataItem,
  SalesQueryHistoryItem,
  SalesWeeklyDataItem,
} from "@/features/sales/types/sales-screen";
import { formatWon } from "@/features/sales/utils/format";

export const toSalesQueryHistoryItem = (
  prompt: string,
  response: SalesQueryResponse,
): SalesQueryHistoryItem => ({
  query: prompt,
  answer: response.text ?? "",
  insights: response.actions ?? [],
  storeContext: response.store_context ?? "",
  dataSource: response.data_source ?? "",
  comparisonBasis: response.comparison_basis ?? "",
  calculationDate: response.calculation_date ?? "",
});

export const toSalesStats = (summary?: SalesSummaryResponse) => {
  const todayRevenue = summary?.today_revenue ?? 0;
  const todayNetRevenue = summary?.today_net_revenue ?? 0;
  const dataDate = summary?.data_date;

  return [
    {
      label: dataDate
        ? `매출 (${dataDate.slice(0, 4)}-${dataDate.slice(4, 6)}-${dataDate.slice(6, 8)})`
        : "최근 매출",
      value: formatWon(todayRevenue),
      tone: "default" as const,
    },
    {
      label: "순매출 (할인 후)",
      value: formatWon(todayNetRevenue),
      tone: "success" as const,
    },
    {
      label: "할인 금액",
      value: formatWon(todayRevenue - todayNetRevenue),
      tone: "danger" as const,
    },
    {
      label: "데이터 기준일",
      value: dataDate
        ? `${dataDate.slice(0, 4)}.${dataDate.slice(4, 6)}.${dataDate.slice(6, 8)}`
        : "조회 중",
      tone: "primary" as const,
    },
  ];
};

export const toSalesWeeklyData = (
  summary?: SalesSummaryResponse,
): SalesWeeklyDataItem[] =>
  (summary?.weekly_data ?? []).map((item) => ({
    day: item.day,
    revenue: item.revenue,
    net_revenue: item.net_revenue,
  }));

export const toSalesProductData = (
  summary?: SalesSummaryResponse,
): SalesProductDataItem[] =>
  (summary?.top_products ?? []).map((item) => ({
    name: item.name,
    sales: item.sales,
    qty: item.qty,
  }));

export const toSuggestedQuestions = (prompts?: SalesPrompt[]) =>
  (prompts ?? []).map((item) => item.prompt);

export const toQuickQuestions = (prompts?: SalesPrompt[]) =>
  (prompts ?? []).slice(0, 4).map((item) => item.label);
