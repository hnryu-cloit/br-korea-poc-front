import { useQuery } from "@tanstack/react-query";

import { getProductionInventoryStatus } from "@/features/production/api/production";

export const useGetProductionInventoryStatusQuery = (storeId: string) =>
  useQuery({
    queryKey: ["production-inventory-status", storeId],
    queryFn: () => getProductionInventoryStatus(storeId),
    enabled: !!storeId,
  });
