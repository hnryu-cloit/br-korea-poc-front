import axiosInstance from "@/services/axiosInstance";

import type {
  CreateProductionRegistrationRequest,
  CreateProductionRegistrationResponse,
  GetProductionOverviewRequest,
  GetProductionOverviewResponse,
  GetProductionRegistrationFormRequest,
  GetProductionRegistrationFormResponse,
  GetProductionSkuListRequest,
  GetProductionSkuListResponse,
} from "@/features/production/type/production";

export function fetchProductionOverview(params: GetProductionOverviewRequest) {
  return axiosInstance.get<GetProductionOverviewResponse>("/api/production/overview", {
    params: { ...params },
  });
}

export function fetchProductionSkuList(params: GetProductionSkuListRequest) {
  return axiosInstance.get<GetProductionSkuListResponse>("/api/production/skus", {
    params: { ...params },
  });
}

export function fetchProductionRegistrationForm(params: GetProductionRegistrationFormRequest) {
  return axiosInstance.get<GetProductionRegistrationFormResponse>("/api/production/registrations/form", {
    params: { ...params },
  });
}

export function createProductionRegistration(payload: CreateProductionRegistrationRequest) {
  return axiosInstance.post<CreateProductionRegistrationResponse>("/api/production/registrations", payload);
}
