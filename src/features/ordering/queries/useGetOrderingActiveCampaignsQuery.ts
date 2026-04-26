import { useQuery } from "@tanstack/react-query";

import { getOrderingActiveCampaigns } from "@/features/ordering/api/ordering";
import { orderingQueryKeys } from "@/features/ordering/queries/orderingQueryKeys";
import type { OrderingActiveCampaignsParams } from "@/features/ordering/types/ordering";

export const useGetOrderingActiveCampaignsQuery = (params?: OrderingActiveCampaignsParams) =>
  useQuery({
    queryKey: orderingQueryKeys.activeCampaigns(params),
    queryFn: () => getOrderingActiveCampaigns(params),
    staleTime: 60 * 1000,
  });
