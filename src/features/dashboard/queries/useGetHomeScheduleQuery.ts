import { useQuery } from "@tanstack/react-query";

import { getHomeSchedule } from "@/features/dashboard/api/schedule";

export function useGetHomeScheduleQuery(storeId?: string) {
  return useQuery({
    queryKey: ["home", "schedule", storeId ?? "all"],
    queryFn: () => getHomeSchedule(storeId),
  });
}
