import { useQuery } from "@tanstack/react-query";

import { getProductionOverview } from "@/features/production/api/production";
import { productionOverviewMock } from "@/features/production/mockdata/overview";
import { productionQueryKeys } from "@/features/production/queries/queryKeys";
import type { GetProductionOverviewRequest } from "@/features/production/types/production";

export function useProductionOverviewQuery(params: GetProductionOverviewRequest) {
  return useQuery({
    queryKey: productionQueryKeys.overview(params),
    queryFn: () => getProductionOverview(params),
    select: () => productionOverviewMock,
  });
}
