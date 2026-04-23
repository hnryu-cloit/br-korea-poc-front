import { useQuery } from "@tanstack/react-query";

import { getProductionWasteSummary } from "@/features/production/api/production";
import { productionQueryKeys } from "@/features/production/queries/productionQueryKeys";

export const useGetProductionWasteQuery = (storeId: string, page = 1, pageSize = 10) =>
  useQuery({
    queryKey: productionQueryKeys.waste(storeId, page, pageSize),
    queryFn: () => getProductionWasteSummary(storeId, page, pageSize),
    enabled: !!storeId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
