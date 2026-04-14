import { useQuery } from "@tanstack/react-query";

import { getProductionAlerts } from "@/features/production/api/production";
import { productionQueryKeys } from "@/features/production/queries/productionQueryKeys";

export const useGetProductionAlertsQuery = () =>
  useQuery({
    queryKey: productionQueryKeys.alerts(),
    queryFn: getProductionAlerts,
  });
