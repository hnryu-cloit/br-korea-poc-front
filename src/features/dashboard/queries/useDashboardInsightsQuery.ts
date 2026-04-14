import { useQuery } from "@tanstack/react-query";

import { getDashboardInsights } from "@/features/dashboard/api/dashboard";
import { dashboardInsightsMock } from "@/features/dashboard/mockdata/insights";
import { dashboardQueryKeys } from "@/features/dashboard/queries/queryKeys";
import type { DashboardOverviewRequest } from "@/features/dashboard/types/dashboard";

export function useDashboardInsightsQuery(params: DashboardOverviewRequest) {
  return useQuery({
    queryKey: dashboardQueryKeys.insights(params),
    queryFn: () => getDashboardInsights(params),
    select: () => dashboardInsightsMock,
  });
}
