import { useQuery } from "@tanstack/react-query";

import { getStores } from "@/features/stores/api/stores";

export const storeQueryKeys = {
  all: ["stores"] as const,
};

export const useGetStoresQuery = (enabled = true) =>
  useQuery({
    queryKey: storeQueryKeys.all,
    queryFn: getStores,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
