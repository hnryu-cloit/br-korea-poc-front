import { useQuery } from "@tanstack/react-query";

import { getOrderingContext } from "@/features/ordering/api/ordering";
import { orderingQueryKeys } from "@/features/ordering/queries/orderingQueryKeys";

export const useGetOrderingContextQuery = (notificationId: number | null) =>
  useQuery({
    queryKey: orderingQueryKeys.context(notificationId ?? -1),
    queryFn: () => getOrderingContext({ notification_id: notificationId ?? -1 }),
    enabled: notificationId !== null,
    staleTime: 5 * 60 * 1000,
  });
