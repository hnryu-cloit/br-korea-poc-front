import { useQuery } from "@tanstack/react-query";

import { getOrderingDeadline } from "@/features/ordering/api/ordering";
import { orderingQueryKeys } from "@/features/ordering/queries/orderingQueryKeys";
import type { OrderingDeadlineParams } from "@/features/ordering/types/ordering";

export const useGetOrderingDeadlineQuery = (params?: OrderingDeadlineParams) =>
  useQuery({
    queryKey: orderingQueryKeys.deadline(params),
    queryFn: () => getOrderingDeadline(params),
  });
