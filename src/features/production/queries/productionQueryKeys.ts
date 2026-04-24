import type { FifoLotType, ProductionSkuListParams } from "@/features/production/types/production";

export const productionQueryKeys = {
  all: ["production"] as const,
  overview: () => [...productionQueryKeys.all, "overview"] as const,
  skuListAll: () => [...productionQueryKeys.all, "sku-list"] as const,
  skuList: (params?: ProductionSkuListParams) =>
    [...productionQueryKeys.skuListAll(), params ?? {}] as const,
  skuDetailAll: () => [...productionQueryKeys.all, "sku-detail"] as const,
  skuDetail: (skuId: string, storeId: string) =>
    [...productionQueryKeys.all, "sku-detail", skuId, storeId] as const,
  inventoryStatus: (storeId: string, page: number, pageSize: number) =>
    [...productionQueryKeys.all, "inventory-status", storeId, page, pageSize] as const,
  waste: (storeId: string, page: number, pageSize: number) =>
    [...productionQueryKeys.all, "waste", storeId, page, pageSize] as const,
  fifoLots: (storeId: string, lotType: FifoLotType, page: number, pageSize: number) =>
    [...productionQueryKeys.all, "fifo-lots", storeId, lotType, page, pageSize] as const,
};
