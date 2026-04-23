import axiosInstance from "@/services/axiosInstance";

import type {
  DashboardAlertsResponse,
  DashboardHomeRequest,
  DashboardNoticesResponse,
  DashboardSummaryCardsResponse,
  ScheduleResponse,
} from "@/features/dashboard/types/dashboard";

export async function getDashboardNotices(params: DashboardHomeRequest) {
  const response = await axiosInstance.get<DashboardNoticesResponse>("/api/dashboard/notices", {
    params,
  });
  return response.data;
}

export async function getHomeSchedule(params: DashboardHomeRequest) {
  const response = await axiosInstance.get<ScheduleResponse>("/api/home/schedule", {
    params,
  });
  return response.data;
}

export async function getDashboardAlerts(params: DashboardHomeRequest) {
  const response = await axiosInstance.get<DashboardAlertsResponse>("/api/dashboard/alerts", {
    params,
  });
  return response.data;
}

export async function getDashboardSummaryCards(params: DashboardHomeRequest) {
  const response = await axiosInstance.get<DashboardSummaryCardsResponse>(
    "/api/dashboard/summary-cards",
    {
      params,
    },
  );
  return response.data;
}
