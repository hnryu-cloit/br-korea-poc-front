import { useQuery } from "@tanstack/react-query";
import type { ScheduleResponse } from "@/features/dashboard/types/dashboard";
import { getHomeSchedule } from "@/features/dashboard/api/dashboard";
import { dashboardQueryKeys } from "@/features/dashboard/queries/dashboardQueryKeys";
import type { DashboardHomeRequest } from "@/features/dashboard/types/dashboard";

export function useGetHomeScheduleQuery(params: DashboardHomeRequest) {
  return useQuery<ScheduleResponse>({
    queryKey: dashboardQueryKeys.schedule(params),
    queryFn: () => getHomeSchedule(params),
    staleTime: 5 * 60 * 1000,
  });
}
