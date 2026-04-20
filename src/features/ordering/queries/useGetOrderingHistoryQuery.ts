import { useQuery } from "@tanstack/react-query";

import { getOrderingHistory } from "@/features/ordering/api/ordering";
import { orderingQueryKeys } from "@/features/ordering/queries/orderingQueryKeys";
import type { OrderingHistoryParams } from "@/features/ordering/types/ordering";

export const useGetOrderingHistoryQuery = (params?: OrderingHistoryParams) =>
  useQuery({
    queryKey: orderingQueryKeys.history(params),
    queryFn: () => getOrderingHistory(params),
    enabled: !!params?.store_id,
  });
