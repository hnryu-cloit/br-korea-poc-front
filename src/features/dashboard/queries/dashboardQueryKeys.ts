import type { DashboardHomeRequest } from "@/features/dashboard/types/dashboard";

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  notices: (params: DashboardHomeRequest) => [...dashboardQueryKeys.all, "notices", params] as const,
  schedule: (params: DashboardHomeRequest) =>
    [...dashboardQueryKeys.all, "schedule", params] as const,
  alerts: (params: DashboardHomeRequest) => [...dashboardQueryKeys.all, "alerts", params] as const,
  summaryCards: (params: DashboardHomeRequest) =>
    [...dashboardQueryKeys.all, "summary-cards", params] as const,
};
