import { useQuery } from "@tanstack/react-query";

import { getHqAnalyticsMarketInsights } from "@/features/analytics/api/analytics";
import { analyticsQueryKeys } from "@/features/analytics/queries/analyticsQueryKeys";
import type { GetMarketIntelligenceRequest } from "@/features/analytics/types/analytics";

export const useGetHqAnalyticsMarketInsightsQuery = (
  params?: GetMarketIntelligenceRequest & { limit?: number },
  enabled: boolean = true,
) =>
  useQuery({
    queryKey: analyticsQueryKeys.hqMarketInsights(params),
    queryFn: () => getHqAnalyticsMarketInsights(params),
    enabled,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    refetchInterval: 45_000,
    retry: 1,
    retryDelay: 800,
  });
