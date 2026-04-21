import { useQuery } from "@tanstack/react-query";

import { getSalesCampaignEffect } from "@/features/sales/api/sales";
import { salesQueryKeys } from "@/features/sales/queries/salesQueryKeys";
import type { GetSalesInsightsRequest } from "@/features/sales/types/sales";

export const useGetSalesCampaignEffectQuery = (params?: GetSalesInsightsRequest) =>
  useQuery({
    queryKey: salesQueryKeys.campaignEffect(params),
    queryFn: () => getSalesCampaignEffect(params),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    refetchInterval: 45_000,
    retry: 1,
    retryDelay: 800,
  });
