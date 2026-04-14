import axiosInstance from "@/services/axiosInstance";

import type {
  DashboardCardsResponse,
  DashboardInsightsResponse,
  DashboardOverviewRequest,
  DashboardOverviewResponse,
} from "@/features/dashboard/types/dashboard";

export async function getDashboardOverview(params: DashboardOverviewRequest) {
  const response = await axiosInstance.get<DashboardOverviewResponse>("/api/dashboard/overview", {
    params: { ...params },
  });
  return response.data;
}

export async function getDashboardCards(params: DashboardOverviewRequest) {
  const response = await axiosInstance.get<DashboardCardsResponse>("/api/dashboard/cards", {
    params: { ...params },
  });
  return response.data;
}

export async function getDashboardInsights(params: DashboardOverviewRequest) {
  const response = await axiosInstance.get<DashboardInsightsResponse>("/api/dashboard/insights", {
    params: { ...params },
  });
  return response.data;
}
