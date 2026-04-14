import { useQuery } from "@tanstack/react-query";

import { getProductionOverview } from "@/features/production/api/production";
import { productionQueryKeys } from "@/features/production/queries/productionQueryKeys";
import type { ProductionOverviewParams } from "@/features/production/types/production";

export const useGetProductionOverviewQuery = (
  params?: ProductionOverviewParams,
) =>
  useQuery({
    queryKey: productionQueryKeys.overview(params),
    queryFn: () => getProductionOverview(params ?? {}),
  });
