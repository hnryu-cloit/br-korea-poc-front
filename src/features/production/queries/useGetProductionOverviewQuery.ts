import { useQuery } from "@tanstack/react-query";

import { getProductionOverview } from "@/features/production/api/production";
import { productionQueryKeys } from "@/features/production/queries/productionQueryKeys";

export const useGetProductionOverviewQuery = () =>
  useQuery({
    queryKey: productionQueryKeys.overview(),
    queryFn: getProductionOverview,
    refetchInterval: (query) => {
      const minutes = query.state.data?.refresh_interval_minutes ?? 5;
      return minutes * 60 * 1000;
    },
    refetchIntervalInBackground: false,
  });
