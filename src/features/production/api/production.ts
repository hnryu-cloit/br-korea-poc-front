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
} from "@/features/production/types/production";

export async function getProductionOverview(params: GetProductionOverviewRequest) {
  const response = await axiosInstance.get<GetProductionOverviewResponse>("/api/production/overview", {
    params: { ...params },
  });
  return response.data;
}

export async function getProductionSkuList(params: GetProductionSkuListRequest) {
  const response = await axiosInstance.get<GetProductionSkuListResponse>("/api/production/skus", {
    params: { ...params },
  });
  return response.data;
}

export async function getProductionRegistrationForm(params: GetProductionRegistrationFormRequest) {
  const response = await axiosInstance.get<GetProductionRegistrationFormResponse>("/api/production/registrations/form", {
    params: { ...params },
  });
  return response.data;
}

export async function postProductionRegistration(payload: CreateProductionRegistrationRequest) {
  const response = await axiosInstance.post<CreateProductionRegistrationResponse>("/api/production/registrations", payload);
  return response.data;
}
