import { useQuery } from "@tanstack/react-query";

import { getDashboardNotices } from "@/features/dashboard/api/dashboard";
import { dashboardQueryKeys } from "@/features/dashboard/queries/dashboardQueryKeys";
import type { DashboardHomeRequest } from "@/features/dashboard/types/dashboard";

export function useGetDashboardNoticesQuery(params: DashboardHomeRequest) {
  return useQuery({
    queryKey: dashboardQueryKeys.notices(params),
    queryFn: () => getDashboardNotices(params),
    staleTime: 5 * 60 * 1000,
  });
}
