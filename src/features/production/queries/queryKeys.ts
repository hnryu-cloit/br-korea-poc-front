import type {
  GetProductionOverviewRequest,
  GetProductionRegistrationFormRequest,
} from "@/features/production/type/production";

export const productionQueryKeys = {
  all: ["production"] as const,
  overview: (params: GetProductionOverviewRequest) => [...productionQueryKeys.all, "overview", params] as const,
  registrationForm: (params: GetProductionRegistrationFormRequest) =>
    [...productionQueryKeys.all, "registration-form", params] as const,
};
