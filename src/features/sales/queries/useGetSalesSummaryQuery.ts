import { useQuery } from "@tanstack/react-query";

import { getSalesSummary } from "@/features/sales/api/sales";
import { salesQueryKeys } from "@/features/sales/queries/salesQueryKeys";
import type { GetSalesInsightsRequest } from "@/features/sales/types/sales";

export const useGetSalesSummaryQuery = (params?: GetSalesInsightsRequest) =>
  useQuery({
    queryKey: salesQueryKeys.summary(params),
    queryFn: () => getSalesSummary(params),
    staleTime: 60_000,
  });
