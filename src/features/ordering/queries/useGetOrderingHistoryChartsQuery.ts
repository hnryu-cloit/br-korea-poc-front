import { useQuery } from "@tanstack/react-query";

import { getOrderingHistoryCharts } from "@/features/ordering/api/ordering";
import { orderingQueryKeys } from "@/features/ordering/queries/orderingQueryKeys";
import type { OrderingHistoryParams } from "@/features/ordering/types/ordering";

export const useGetOrderingHistoryChartsQuery = (params?: OrderingHistoryParams) =>
  useQuery({
    queryKey: orderingQueryKeys.historyCharts(params),
    queryFn: () => getOrderingHistoryCharts(params),
    enabled: !!params?.store_id,
    staleTime: 5 * 60 * 1000,
  });
