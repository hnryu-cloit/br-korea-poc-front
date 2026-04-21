import { useQuery } from "@tanstack/react-query";

import { getSalesInsights } from "@/features/sales/api/sales";
import { salesQueryKeys } from "@/features/sales/queries/salesQueryKeys";
import type { GetSalesInsightsRequest } from "@/features/sales/types/sales";

export const useGetSalesInsightsQuery = (params?: GetSalesInsightsRequest) =>
  useQuery({
    queryKey: salesQueryKeys.insights(params),
    queryFn: () => getSalesInsights(params),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    refetchInterval: 45_000,
    retry: 1,
    retryDelay: 800,
  });
