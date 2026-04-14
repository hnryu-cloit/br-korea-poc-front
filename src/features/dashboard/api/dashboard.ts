import axiosInstance from "@/services/axiosInstance";

import type {
  DashboardOverviewRequest,
  DashboardOverviewResponse,
} from "@/features/dashboard/types/dashboard";

export const getDashboardOverview = async (
  params: DashboardOverviewRequest,
) => {
  const response = await axiosInstance.get<DashboardOverviewResponse>(
    "/api/home/overview",
    { params },
  );
  return response.data;
};
