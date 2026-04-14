import { useQuery } from "@tanstack/react-query";

import { getProductionRegistrationForm } from "@/features/production/api/production";
import { productionRegistrationFormMock } from "@/features/production/mockdata/registrationForm";
import { productionQueryKeys } from "@/features/production/queries/queryKeys";
import type { GetProductionRegistrationFormRequest } from "@/features/production/types/production";

export function useProductionRegistrationFormQuery(params?: GetProductionRegistrationFormRequest) {
  return useQuery({
    queryKey: params
      ? productionQueryKeys.registrationForm(params)
      : [...productionQueryKeys.all, "registration-form", "idle"],
    queryFn: () => getProductionRegistrationForm(params as GetProductionRegistrationFormRequest),
    select: () => (params ? productionRegistrationFormMock.find((item) => item.sku_id === params.sku_id) : undefined),
  });
}
