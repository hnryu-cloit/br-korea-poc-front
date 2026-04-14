import type { ProductionSkuListParams } from "@/features/production/types/production";

export const productionQueryKeys = {
  all: ["production"] as const,
  overview: () => [...productionQueryKeys.all, "overview"] as const,
  skuListAll: () => [...productionQueryKeys.all, "sku-list"] as const,
  skuList: (params?: ProductionSkuListParams) =>
    [...productionQueryKeys.skuListAll(), params ?? {}] as const,
  skuDetail: (skuId: string, storeId: string) =>
    [...productionQueryKeys.all, "sku-detail", skuId, storeId] as const,
};
