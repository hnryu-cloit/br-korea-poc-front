import { useQuery } from "@tanstack/react-query";

import { getAnalyticsMetrics } from "@/features/analytics/api/analytics";
import { analyticsQueryKeys } from "@/features/analytics/queries/analyticsQueryKeys";

export const useGetAnalyticsMetricsQuery = () =>
  useQuery({
    queryKey: analyticsQueryKeys.metrics(),
    queryFn: getAnalyticsMetrics,
  });
