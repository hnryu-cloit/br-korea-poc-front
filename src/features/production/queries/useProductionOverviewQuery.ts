import { useQuery } from "@tanstack/react-query";

import { fetchProductionOverview } from "@/features/production/api";
import { productionOverviewMock } from "@/features/production/mockdata/overview";
import { productionQueryKeys } from "@/features/production/queries/queryKeys";
import type { GetProductionOverviewRequest } from "@/features/production/type/production";

export function useProductionOverviewQuery(params: GetProductionOverviewRequest) {
  return useQuery({
    queryKey: productionQueryKeys.overview(params),
    queryFn: () => fetchProductionOverview(params),
    select: () => productionOverviewMock,
  });
}
