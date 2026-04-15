import { useQuery } from "@tanstack/react-query";

import { getProductionSkuList } from "@/features/production/api/production";
import { productionQueryKeys } from "@/features/production/queries/productionQueryKeys";
import type { ProductionSkuListParams } from "@/features/production/types/production";

export const useGetProductionSkuListQuery = (params: ProductionSkuListParams) =>
  useQuery({
    queryKey: productionQueryKeys.skuList(params),
    queryFn: () => getProductionSkuList(params),
    refetchInterval: 5 * 60 * 1000,
    refetchIntervalInBackground: false,
  });
