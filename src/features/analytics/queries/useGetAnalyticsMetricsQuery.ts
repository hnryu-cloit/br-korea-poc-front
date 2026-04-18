import { useQuery } from "@tanstack/react-query";

import { getAnalyticsMetrics } from "@/features/analytics/api/analytics";
import { analyticsQueryKeys } from "@/features/analytics/queries/analyticsQueryKeys";
import type { GetAnalyticsMetricsRequest } from "@/features/analytics/types/analytics";

export const useGetAnalyticsMetricsQuery = (params?: GetAnalyticsMetricsRequest) =>
  useQuery({
    queryKey: analyticsQueryKeys.metrics(params),
    queryFn: () => getAnalyticsMetrics(params),
  });
