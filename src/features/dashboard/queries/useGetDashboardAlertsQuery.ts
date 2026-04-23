import { useQuery } from "@tanstack/react-query";

import { getDashboardAlerts } from "@/features/dashboard/api/dashboard";
import { dashboardQueryKeys } from "@/features/dashboard/queries/dashboardQueryKeys";
import type { DashboardHomeRequest } from "@/features/dashboard/types/dashboard";

export function useGetDashboardAlertsQuery(params: DashboardHomeRequest) {
  return useQuery({
    queryKey: dashboardQueryKeys.alerts(params),
    queryFn: () => getDashboardAlerts(params),
    staleTime: 5 * 60 * 1000,
  });
}
