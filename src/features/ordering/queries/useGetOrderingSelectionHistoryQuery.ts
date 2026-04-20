import { useQuery } from "@tanstack/react-query";

import { getOrderingSelectionHistory } from "@/features/ordering/api/ordering";
import { orderingQueryKeys } from "@/features/ordering/queries/orderingQueryKeys";
import type { OrderingSelectionHistoryParams } from "@/features/ordering/types/ordering";

export const useGetOrderingSelectionHistoryQuery = (params?: OrderingSelectionHistoryParams) =>
  useQuery({
    queryKey: orderingQueryKeys.selectionHistory(params),
    queryFn: () => getOrderingSelectionHistory(params),
  });
