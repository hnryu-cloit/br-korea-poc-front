import axiosInstance from "@/services/axiosInstance";

import type {
  DashboardOverviewRequest,
  DashboardOverviewResponse,
  ScheduleResponse,
} from "@/features/dashboard/types/dashboard";

export const getDashboardOverview = async (params: DashboardOverviewRequest) => {
  const response = await axiosInstance.get<DashboardOverviewResponse>("/api/home/overview", {
    params,
  });
  return response.data;
};

export async function getHomeSchedule(storeId?: string) {
  const response = await axiosInstance.get<ScheduleResponse>("/api/home/schedule", {
    params: storeId ? { store_id: storeId } : undefined,
  });
  return response.data;
}
