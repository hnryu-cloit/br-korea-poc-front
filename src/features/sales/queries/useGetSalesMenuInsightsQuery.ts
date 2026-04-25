import { useQuery } from "@tanstack/react-query";

import { getSalesMenuInsights } from "@/features/sales/api/sales";
import { salesQueryKeys } from "@/features/sales/queries/salesQueryKeys";
import type { GetSalesInsightsRequest } from "@/features/sales/types/sales";

export const useGetSalesMenuInsightsQuery = (params?: GetSalesInsightsRequest) =>
  useQuery({
    queryKey: salesQueryKeys.menuInsights(params),
    queryFn: () => getSalesMenuInsights(params),
    staleTime: 5 * 60_000,
    gcTime: 15 * 60_000,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    retry: 1,
    retryDelay: 1500,
  });
