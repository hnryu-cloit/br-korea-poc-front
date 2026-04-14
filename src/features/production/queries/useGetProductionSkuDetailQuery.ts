import { useQuery } from "@tanstack/react-query";

import { getProductionSkuDetail } from "@/features/production/api/production";
import { productionQueryKeys } from "@/features/production/queries/productionQueryKeys";

export const useGetProductionSkuDetailQuery = (skuId: string | null, storeId: string | null) =>
  useQuery({
    queryKey: productionQueryKeys.skuDetail(skuId ?? "", storeId ?? ""),
    queryFn: () => getProductionSkuDetail(skuId ?? "", storeId ?? ""),
    enabled: Boolean(skuId) && Boolean(storeId),
  });
