import axiosInstance from "@/services/axiosInstance";

import type {
  DashboardCardsResponse,
  DashboardInsightsResponse,
  DashboardOverviewRequest,
  DashboardOverviewResponse,
} from "@/features/dashboard/type/dashboard";

export async function fetchDashboardOverview(params: DashboardOverviewRequest) {
  const response = await axiosInstance.get<DashboardOverviewResponse>("/api/dashboard/overview", {
    params: { ...params },
  });
  return response.data;
}

export async function fetchDashboardCards(params: DashboardOverviewRequest) {
  const response = await axiosInstance.get<DashboardCardsResponse>("/api/dashboard/cards", {
    params: { ...params },
  });
  return response.data;
}

export async function fetchDashboardInsights(params: DashboardOverviewRequest) {
  const response = await axiosInstance.get<DashboardInsightsResponse>("/api/dashboard/insights", {
    params: { ...params },
  });
  return response.data;
}
