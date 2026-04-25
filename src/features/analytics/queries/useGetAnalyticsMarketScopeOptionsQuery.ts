import { useQuery } from "@tanstack/react-query";

import { getAnalyticsMarketScopeOptions } from "@/features/analytics/api/analytics";
import { analyticsQueryKeys } from "@/features/analytics/queries/analyticsQueryKeys";

export const useGetAnalyticsMarketScopeOptionsQuery = () =>
  useQuery({
    queryKey: analyticsQueryKeys.marketScopeOptions(),
    queryFn: getAnalyticsMarketScopeOptions,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
