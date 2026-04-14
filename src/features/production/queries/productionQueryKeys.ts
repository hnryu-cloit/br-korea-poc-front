export const productionQueryKeys = {
  all: ["production"] as const,
  overview: () => [...productionQueryKeys.all, "overview"] as const,
  skuList: () => [...productionQueryKeys.all, "sku-list"] as const,
  skuDetail: (skuId: string, storeId: string) =>
    [...productionQueryKeys.all, "sku-detail", skuId, storeId] as const,
};
