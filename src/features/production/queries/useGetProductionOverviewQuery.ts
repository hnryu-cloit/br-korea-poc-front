import { useQuery } from "@tanstack/react-query";

import { getProductionOverview } from "@/features/production/api/production";
import { productionQueryKeys } from "@/features/production/queries/productionQueryKeys";

export const useGetProductionOverviewQuery = () =>
  useQuery({
    queryKey: productionQueryKeys.overview(),
    queryFn: getProductionOverview,
  });
