import { useQuery } from "@tanstack/react-query";

import { getAnalyticsCustomerProfile } from "@/features/analytics/api/analytics";
import { analyticsQueryKeys } from "@/features/analytics/queries/analyticsQueryKeys";

export const useGetAnalyticsCustomerProfileQuery = (storeId: string) =>
  useQuery({
    queryKey: analyticsQueryKeys.customerProfile(storeId),
    queryFn: () => getAnalyticsCustomerProfile(storeId),
    enabled: !!storeId,
  });
