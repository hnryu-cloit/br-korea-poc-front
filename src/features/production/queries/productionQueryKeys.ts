import type {
  ProductionOverviewParams,
  ProductionRegistrationHistoryParams,
  ProductionRegistrationSummaryParams,
} from "@/features/production/types/production";

export const productionQueryKeys = {
  all: ["production"] as const,
  overview: (params?: ProductionOverviewParams) =>
    [...productionQueryKeys.all, "overview", params ?? {}] as const,
  alerts: () => [...productionQueryKeys.all, "alerts"] as const,
  registrationHistory: (params?: ProductionRegistrationHistoryParams) =>
    [...productionQueryKeys.all, "registration-history", params ?? {}] as const,
  registrationSummary: (params?: ProductionRegistrationSummaryParams) =>
    [...productionQueryKeys.all, "registration-summary", params ?? {}] as const,
};
