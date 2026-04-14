import { useQuery } from "@tanstack/react-query";

import { fetchProductionSkuList } from "@/features/production/api";
import { productionSkuListMock } from "@/features/production/mockdata/skuList";
import { productionQueryKeys } from "@/features/production/queries/queryKeys";
import type { GetProductionSkuListRequest } from "@/features/production/type/production";

export function useProductionSkuListQuery(params: GetProductionSkuListRequest) {
  return useQuery({
    queryKey: productionQueryKeys.skuList(params),
    queryFn: () => fetchProductionSkuList(params),
    select: () => productionSkuListMock,
  });
}
