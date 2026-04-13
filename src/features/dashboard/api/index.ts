
import type {
  DashboardCardsResponse,
  DashboardInsightsResponse,
  DashboardOverviewResponse,
  DashboardOverviewRequest,
} from "@/features/dashboard/type/dashboard";
import axiosInstance from "@/services/axiosInstance";

export function fetchDashboardOverview(params: DashboardOverviewRequest) {
  return axiosInstance.get<DashboardOverviewResponse>("/api/dashboard/overview", {
    params: { ...params },
  });
}

export function fetchDashboardCards(params: DashboardOverviewRequest) {
  return axiosInstance.get<DashboardCardsResponse>("/api/dashboard/cards", {
    params: { ...params },
  });
}

export function fetchDashboardInsights(params: DashboardOverviewRequest) {
  return axiosInstance.get<DashboardInsightsResponse>("/api/dashboard/insights", {
    params: { ...params },
  });
}
