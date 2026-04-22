import { useQuery } from "@tanstack/react-query";
import type { ScheduleResponse } from "@/features/dashboard/types/dashboard";
import { getHomeSchedule } from "@/features/dashboard/api/dashboard";
import { dashboardQueryKeys } from "@/features/dashboard/queries/dashboardQueryKeys";

export function useGetHomeScheduleQuery(storeId?: string) {
  return useQuery<ScheduleResponse>({
    queryKey: dashboardQueryKeys.schedule(storeId ?? "all"),
    queryFn: () => getHomeSchedule(storeId),
    staleTime: 5 * 60 * 1000,
  });
}
