import { useQuery } from "@tanstack/react-query";

import { getSalesCampaignEffect } from "@/features/sales/api/sales";
import { salesQueryKeys } from "@/features/sales/queries/salesQueryKeys";
import type { GetSalesInsightsRequest } from "@/features/sales/types/sales";

export const useGetSalesCampaignEffectQuery = (params?: GetSalesInsightsRequest) =>
  useQuery({
    queryKey: salesQueryKeys.campaignEffect(params),
    queryFn: () => getSalesCampaignEffect(params),
    staleTime: 60_000,
  });
