import { useQuery } from "@tanstack/react-query";

import { fetchDashboardInsights } from "@/features/dashboard/api";
import { dashboardInsightsMock } from "@/features/dashboard/mockdata/insights";
import { dashboardQueryKeys } from "@/features/dashboard/queries/queryKeys";
import type { DashboardOverviewRequest } from "@/features/dashboard/type/dashboard";

export function useDashboardInsightsQuery(params: DashboardOverviewRequest) {
  return useQuery({
    queryKey: dashboardQueryKeys.insights(params),
    queryFn: () => fetchDashboardInsights(params),
    select: () => dashboardInsightsMock,
  });
}
