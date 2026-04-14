import { useQuery } from "@tanstack/react-query";

import { fetchProductionRegistrationForm } from "@/features/production/api";
import { productionRegistrationFormMock } from "@/features/production/mockdata/registrationForm";
import { productionQueryKeys } from "@/features/production/queries/queryKeys";
import type { GetProductionRegistrationFormRequest } from "@/features/production/type/production";

export function useProductionRegistrationFormQuery(params?: GetProductionRegistrationFormRequest) {
  return useQuery({
    queryKey: params
      ? productionQueryKeys.registrationForm(params)
      : [...productionQueryKeys.all, "registration-form", "idle"],
    queryFn: () => fetchProductionRegistrationForm(params as GetProductionRegistrationFormRequest),
    select: () => (params ? productionRegistrationFormMock.find((item) => item.sku_id === params.sku_id) : undefined),
  });
}
