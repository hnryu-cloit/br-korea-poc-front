import axiosInstance from "@/services/axiosInstance";

import type { GetStoresResponse, Store } from "@/features/stores/types/stores";

export const getStores = async (): Promise<Store[]> => {
  const response = await axiosInstance.get<GetStoresResponse>("/api/stores");
  return response.data.stores;
};
