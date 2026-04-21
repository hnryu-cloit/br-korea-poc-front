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
  });
