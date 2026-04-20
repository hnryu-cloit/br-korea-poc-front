import { useQuery } from "@tanstack/react-query";

import { getOrderingSelectionSummary } from "@/features/ordering/api/ordering";
import { orderingQueryKeys } from "@/features/ordering/queries/orderingQueryKeys";
import type { OrderingSelectionSummaryParams } from "@/features/ordering/types/ordering";

export const useGetOrderingSelectionSummaryQuery = (params?: OrderingSelectionSummaryParams) =>
  useQuery({
    queryKey: orderingQueryKeys.selectionSummary(params),
    queryFn: () => getOrderingSelectionSummary(params),
  });
