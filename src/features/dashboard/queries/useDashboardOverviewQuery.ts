import { useQuery } from "@tanstack/react-query";

import { fetchDashboardOverview } from "@/features/dashboard/api";
import { dashboardOverviewMock } from "@/features/dashboard/mockdata/overview";
import { dashboardQueryKeys } from "@/features/dashboard/queries/queryKeys";
import type { DashboardOverviewRequest } from "@/features/dashboard/type/dashboard";

export function useDashboardOverviewQuery(params: DashboardOverviewRequest) {
  return useQuery({
    queryKey: dashboardQueryKeys.overview(params),
    queryFn: () => fetchDashboardOverview(params),
    select: () => dashboardOverviewMock,
  });
}
