import { useQuery } from "@tanstack/react-query";

import { getProductionSkuList } from "@/features/production/api/production";
import { productionSkuListMock } from "@/features/production/mockdata/skuList";
import { productionQueryKeys } from "@/features/production/queries/queryKeys";
import type { GetProductionSkuListRequest } from "@/features/production/types/production";

export function useProductionSkuListQuery(params: GetProductionSkuListRequest) {
  return useQuery({
    queryKey: productionQueryKeys.skuList(params),
    queryFn: () => getProductionSkuList(params),
    select: () => productionSkuListMock,
  });
}
