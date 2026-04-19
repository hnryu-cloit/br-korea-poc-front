import axiosInstance from "@/services/axiosInstance";

import type { ScheduleResponse } from "@/features/dashboard/types/schedule";

export async function getHomeSchedule(storeId?: string) {
  const response = await axiosInstance.get<ScheduleResponse>("/api/home/schedule", {
    params: storeId ? { store_id: storeId } : undefined,
  });
  return response.data;
}