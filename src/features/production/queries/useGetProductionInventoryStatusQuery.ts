import { useQuery } from "@tanstack/react-query";

import { getProductionInventoryStatus } from "@/features/production/api/production";
import { productionQueryKeys } from "@/features/production/queries/productionQueryKeys";
import type { InventoryStatusFilterCode } from "@/features/production/types/production";

export const useGetProductionInventoryStatusQuery = (
  storeId: string,
  statuses: InventoryStatusFilterCode[],
  page = 1,
  pageSize = 10,
) =>
  useQuery({
    queryKey: productionQueryKeys.inventoryStatus(storeId, statuses, page, pageSize),
    queryFn: () => getProductionInventoryStatus(storeId, statuses, page, pageSize),
    enabled: !!storeId && statuses.length > 0,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
