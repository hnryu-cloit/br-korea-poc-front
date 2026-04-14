import axiosInstance from "@/services/axiosInstance";

import type {
  ProductionOverviewResponse,
  ProductionSkuDetailResponse,
  ProductionSkuListResponse,
  ProductionRegistrationPayload,
  ProductionRegistrationResponse,
} from "@/features/production/types/production";


export const getProductionOverview = async (
) => {
  const response = await axiosInstance.get<ProductionOverviewResponse>(
    "/api/production/overview",
  );
  return response.data;
};

export const getProductionSkuList = async () => {
  const response = await axiosInstance.get<ProductionSkuListResponse>(
    "/api/production/items",
  );
  return response.data;
};

export const getProductionSkuDetail = async (skuId: string, storeId: string) => {
  const response = await axiosInstance.get<ProductionSkuDetailResponse>(
    `/api/production/items/${skuId}`,
    { params: { store_id: storeId } },
  );
  return response.data;
};

export const postProductionRegistration = async (
  payload: ProductionRegistrationPayload,
) => {
  const response = await axiosInstance.post<ProductionRegistrationResponse>(
    "/api/production/registrations",
    payload,
  );
  return response.data;
};
