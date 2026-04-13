import type { DashboardOverviewRequest } from "@/features/dashboard/type/dashboard";

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  overview: (params: DashboardOverviewRequest) => [...dashboardQueryKeys.all, "overview", params] as const,
  cards: (params: DashboardOverviewRequest) => [...dashboardQueryKeys.all, "cards", params] as const,
  insights: (params: DashboardOverviewRequest) => [...dashboardQueryKeys.all, "insights", params] as const,
};
