import type { DashboardOverviewRequest } from "@/features/dashboard/types/dashboard";

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  overview: (params: DashboardOverviewRequest) =>
    [...dashboardQueryKeys.all, "overview", params] as const,
  cards: (params: DashboardOverviewRequest) =>
    [...dashboardQueryKeys.all, "cards", params] as const,
  schedule: (storeId: string) =>
    [...dashboardQueryKeys.all, "schedule", storeId] as const,
};
