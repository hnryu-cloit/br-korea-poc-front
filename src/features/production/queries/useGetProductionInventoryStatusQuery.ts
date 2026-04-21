import { useQuery } from "@tanstack/react-query";

import { getProductionInventoryStatus } from "@/features/production/api/production";

export const useGetProductionInventoryStatusQuery = (storeId: string, page = 1, pageSize = 10) =>
  useQuery({
    queryKey: ["production-inventory-status", storeId, page, pageSize],
    queryFn: () => getProductionInventoryStatus(storeId, page, pageSize),
    enabled: !!storeId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
