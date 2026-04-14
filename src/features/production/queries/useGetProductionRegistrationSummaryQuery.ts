import { useQuery } from "@tanstack/react-query";

import { getProductionRegistrationSummary } from "@/features/production/api/production";
import { productionQueryKeys } from "@/features/production/queries/productionQueryKeys";
import type { ProductionRegistrationSummaryParams } from "@/features/production/types/production";

export const useGetProductionRegistrationSummaryQuery = (
  params?: ProductionRegistrationSummaryParams,
) =>
  useQuery({
    queryKey: productionQueryKeys.registrationSummary(params),
    queryFn: () => getProductionRegistrationSummary(params ?? {}),
  });
