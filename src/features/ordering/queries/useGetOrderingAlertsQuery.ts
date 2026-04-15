import { useQuery } from "@tanstack/react-query";

import { getOrderingAlerts } from "@/features/ordering/api/ordering";
import { orderingQueryKeys } from "@/features/ordering/queries/orderingQueryKeys";
import type { OrderingAlertsParams } from "@/features/ordering/types/ordering";

export const useGetOrderingAlertsQuery = (params?: OrderingAlertsParams) =>
  useQuery({
    queryKey: orderingQueryKeys.alerts(params),
    queryFn: () => getOrderingAlerts(params),
  });
