import { useQuery } from "@tanstack/react-query";

import { getAnalyticsStoreProfile } from "@/features/analytics/api/analytics";
import { analyticsQueryKeys } from "@/features/analytics/queries/analyticsQueryKeys";

export const useGetAnalyticsStoreProfileQuery = (storeId: string) =>
  useQuery({
    queryKey: analyticsQueryKeys.storeProfile(storeId),
    queryFn: () => getAnalyticsStoreProfile(storeId),
    enabled: !!storeId,
  });