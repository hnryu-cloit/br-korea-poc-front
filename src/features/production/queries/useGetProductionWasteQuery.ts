import { useQuery } from "@tanstack/react-query";

import { getProductionWasteSummary } from "@/features/production/api/production";

export const useGetProductionWasteQuery = (storeId: string) =>
  useQuery({
    queryKey: ["production-waste", storeId],
    queryFn: () => getProductionWasteSummary(storeId),
    enabled: !!storeId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
