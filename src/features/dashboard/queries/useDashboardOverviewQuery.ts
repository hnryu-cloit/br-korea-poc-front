import { useQuery } from "@tanstack/react-query";

import { getDashboardOverview } from "@/features/dashboard/api/dashboard";
import { dashboardQueryKeys } from "@/features/dashboard/queries/dashboardQueryKeys";
import type { DashboardOverviewRequest } from "@/features/dashboard/types/dashboard";

export function useGetDashboardOverviewQuery(params: DashboardOverviewRequest) {
  return useQuery({
    queryKey: dashboardQueryKeys.overview(params),
    queryFn: () => getDashboardOverview(params),
    staleTime: 5 * 60 * 1000,
  });
}
