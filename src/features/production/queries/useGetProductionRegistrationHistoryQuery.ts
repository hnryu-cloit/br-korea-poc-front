import { useQuery } from "@tanstack/react-query";

import { getProductionRegistrationHistory } from "@/features/production/api/production";
import { productionQueryKeys } from "@/features/production/queries/productionQueryKeys";
import type { ProductionRegistrationHistoryParams } from "@/features/production/types/production";

export const useGetProductionRegistrationHistoryQuery = (
  params?: ProductionRegistrationHistoryParams,
) =>
  useQuery({
    queryKey: productionQueryKeys.registrationHistory(params),
    queryFn: () => getProductionRegistrationHistory(params ?? {}),
  });
