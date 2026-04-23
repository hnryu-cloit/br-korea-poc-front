import { useQuery } from "@tanstack/react-query";

import { getAnalyticsMarketIntelligence } from "@/features/analytics/api/analytics";
import { analyticsQueryKeys } from "@/features/analytics/queries/analyticsQueryKeys";
import type { GetMarketIntelligenceRequest } from "@/features/analytics/types/analytics";

export const useGetAnalyticsMarketIntelligenceQuery = (params?: GetMarketIntelligenceRequest) =>
  useQuery({
    queryKey: analyticsQueryKeys.marketIntelligence(params),
    queryFn: () => getAnalyticsMarketIntelligence(params),
    enabled: !!params?.store_id,
    staleTime: 5 * 60 * 1000,
  });
