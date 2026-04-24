import { useQuery } from "@tanstack/react-query";

import { getAnalyticsSalesTrend } from "@/features/analytics/api/analytics";
import { analyticsQueryKeys } from "@/features/analytics/queries/analyticsQueryKeys";
import type { GetAnalyticsSalesTrendRequest } from "@/features/analytics/types/analytics";

export const useGetAnalyticsSalesTrendQuery = (
  params?: GetAnalyticsSalesTrendRequest,
  enabled = true,
) =>
  useQuery({
    queryKey: analyticsQueryKeys.salesTrend(params),
    queryFn: () => getAnalyticsSalesTrend(params),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
