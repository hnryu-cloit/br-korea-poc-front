import { useQuery } from "@tanstack/react-query";

import { getAnalyticsMarketInsights } from "@/features/analytics/api/analytics";
import { analyticsQueryKeys } from "@/features/analytics/queries/analyticsQueryKeys";
import type { GetMarketIntelligenceRequest } from "@/features/analytics/types/analytics";

export const useGetAnalyticsMarketInsightsQuery = (params?: GetMarketIntelligenceRequest) =>
  useQuery({
    queryKey: analyticsQueryKeys.marketInsights(params),
    queryFn: () => getAnalyticsMarketInsights(params),
    enabled: !!params?.store_id,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    refetchInterval: 45_000,
    retry: 1,
    retryDelay: 800,
  });
