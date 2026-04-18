import { useMemo } from "react";

import { useGetSalesBenchmarkQuery } from "@/features/sales/queries/useGetSalesBenchmarkQuery";
import type {
  SalesCampaignEffectResponse,
  SalesInsightsResponse,
  SalesPrompt,
  SalesSummaryResponse,
} from "@/features/sales/types/sales";
import { buildSalesOpportunityFromLiveData } from "@/features/sales/utils/sales-opportunity";

export const useSalesOpportunityData = (params: {
  storeId?: string;
  storeName: string;
  summary?: SalesSummaryResponse;
  insights?: SalesInsightsResponse;
  campaignEffect?: SalesCampaignEffectResponse;
  dateFrom?: string;
  dateTo?: string;
  prompts?: SalesPrompt[];
}) => {
  const benchmarkQuery = useGetSalesBenchmarkQuery(
    params.storeId,
    params.dateFrom,
    params.dateTo,
  );

  const opportunity = useMemo(
    () =>
      buildSalesOpportunityFromLiveData({
        storeName: params.storeName,
        summary: params.summary,
        insights: params.insights,
        campaignEffect: params.campaignEffect,
        benchmark: benchmarkQuery.data,
        fallbackPrompts: params.prompts,
      }),
    [
      benchmarkQuery.data,
      params.campaignEffect,
      params.insights,
      params.prompts,
      params.storeName,
      params.summary,
    ],
  );

  return {
    opportunity,
    benchmarkQuery,
  };
};
