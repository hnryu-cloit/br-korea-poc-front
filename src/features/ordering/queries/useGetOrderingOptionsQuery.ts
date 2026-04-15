import { useQuery } from "@tanstack/react-query";

import { getOrderingOptions } from "@/features/ordering/api/ordering";
import { orderingQueryKeys } from "@/features/ordering/queries/orderingQueryKeys";
import type { OrderingOptionsParams } from "@/features/ordering/types/ordering";

export const useGetOrderingOptionsQuery = (params?: OrderingOptionsParams) =>
  useQuery({
    queryKey: orderingQueryKeys.options(params),
    queryFn: () => getOrderingOptions(params),
    refetchInterval: 60 * 1000,
    refetchIntervalInBackground: false,
  });
