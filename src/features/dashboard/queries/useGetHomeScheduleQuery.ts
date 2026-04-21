import { useQuery } from "@tanstack/react-query";
import type { ScheduleResponse } from "@/features/dashboard/types/dashboard";
import { getHomeSchedule } from "../api/dashboard";

export function useGetHomeScheduleQuery(storeId?: string) {
  return useQuery<ScheduleResponse>({
    queryKey: ["home", "schedule", storeId ?? "all"],
    queryFn: () => getHomeSchedule(storeId),
  });
}
