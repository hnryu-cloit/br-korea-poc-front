import { useQuery } from "@tanstack/react-query";

import { getOrderingHistoryInsights } from "@/features/ordering/api/ordering";
import { orderingQueryKeys } from "@/features/ordering/queries/orderingQueryKeys";
import type { OrderingHistoryParams } from "@/features/ordering/types/ordering";

export const useGetOrderingHistoryInsightsQuery = (params?: OrderingHistoryParams) =>
  useQuery({
    queryKey: orderingQueryKeys.historyInsights(params),
    queryFn: () => getOrderingHistoryInsights(params),
    enabled: !!params?.store_id,
  });
