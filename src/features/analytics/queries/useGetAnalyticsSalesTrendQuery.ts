import { useQuery } from "@tanstack/react-query";

import { getAnalyticsSalesTrend } from "@/features/analytics/api/analytics";
import { analyticsQueryKeys } from "@/features/analytics/queries/analyticsQueryKeys";

export const useGetAnalyticsSalesTrendQuery = (storeId?: string) =>
  useQuery({
    queryKey: analyticsQueryKeys.salesTrend(storeId),
    queryFn: () => getAnalyticsSalesTrend(storeId),
  });