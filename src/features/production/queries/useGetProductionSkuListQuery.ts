import { useQuery } from "@tanstack/react-query";

import { getProductionSkuList } from "@/features/production/api/production";
import { productionQueryKeys } from "@/features/production/queries/productionQueryKeys";

export const useGetProductionSkuListQuery = () =>
  useQuery({
    queryKey: productionQueryKeys.skuList(),
    queryFn: getProductionSkuList,
  });
