import type {
  GetProductionOverviewRequest,
  GetProductionRegistrationFormRequest,
  GetProductionSkuListRequest,
} from "@/features/production/types/production";

export const productionQueryKeys = {
  all: ["production"] as const,
  overview: (params: GetProductionOverviewRequest) => [...productionQueryKeys.all, "overview", params] as const,
  skuList: (params: GetProductionSkuListRequest) => [...productionQueryKeys.all, "sku-list", params] as const,
  registrationForm: (params: GetProductionRegistrationFormRequest) =>
    [...productionQueryKeys.all, "registration-form", params] as const,
};
