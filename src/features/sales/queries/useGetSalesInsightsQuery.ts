import { useQuery } from "@tanstack/react-query";

import { getSalesInsights } from "@/features/sales/api/sales";
import { salesQueryKeys } from "@/features/sales/queries/salesQueryKeys";
import type { GetSalesInsightsRequest } from "@/features/sales/types/sales";

export const useGetSalesInsightsQuery = (params?: GetSalesInsightsRequest) =>
  useQuery({
    queryKey: salesQueryKeys.insights(params),
    queryFn: () => getSalesInsights(params),
  });
