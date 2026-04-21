import axiosInstance from "@/services/axiosInstance";

import type {
  InventoryStatusResponse,
  ProductionOverviewResponse,
  ProductionRegistrationPayload,
  ProductionRegistrationResponse,
  ProductionSkuDetailResponse,
  ProductionSkuListParams,
  ProductionSkuListResponse,
  WasteSummaryResponse,
} from "@/features/production/types/production";

export const getProductionOverview = async () => {
  const response = await axiosInstance.get<ProductionOverviewResponse>("/api/production/overview");
  return response.data;
};

export const getProductionSkuList = async (params: ProductionSkuListParams) => {
  const response = await axiosInstance.get<ProductionSkuListResponse>("/api/production/items", {
    params,
  });
  return response.data;
};

export const getProductionSkuDetail = async (skuId: string, storeId: string) => {
  const response = await axiosInstance.get<ProductionSkuDetailResponse>(
    `/api/production/items/${skuId}`,
    { params: { store_id: storeId } },
  );
  return response.data;
};

export const postProductionRegistration = async (payload: ProductionRegistrationPayload) => {
  const response = await axiosInstance.post<ProductionRegistrationResponse>(
    "/api/production/registrations",
    payload,
  );
  return response.data;
};

export const getProductionWasteSummary = async (storeId: string) => {
  const response = await axiosInstance.get<WasteSummaryResponse>("/api/production/waste-summary", {
    params: { store_id: storeId },
  });
  return response.data;
};

export const getProductionInventoryStatus = async (storeId: string, page = 1, pageSize = 10) => {
  const response = await axiosInstance.get<InventoryStatusResponse>(
    "/api/production/inventory-status",
    { params: { store_id: storeId, page, page_size: pageSize } },
  );
  return response.data;
};
