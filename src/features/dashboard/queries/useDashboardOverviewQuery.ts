import { useQuery } from "@tanstack/react-query";

import { getDashboardOverview } from "@/features/dashboard/api/dashboard";
import { dashboardQueryKeys } from "@/features/dashboard/queries/queryKeys";
import type { DashboardOverviewRequest } from "@/features/dashboard/types/dashboard";

export function useDashboardOverviewQuery(params: DashboardOverviewRequest) {
  return useQuery({
    queryKey: dashboardQueryKeys.overview(params),
    queryFn: () => getDashboardOverview(params),
  });
}
