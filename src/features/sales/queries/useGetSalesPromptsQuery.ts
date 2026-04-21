import { useQuery } from "@tanstack/react-query";

import { getSalesPrompts } from "@/features/sales/api/sales";
import { salesQueryKeys } from "@/features/sales/queries/salesQueryKeys";
import type { GetSalesPromptsRequest } from "@/features/sales/types/sales";

export const useGetSalesPromptsQuery = (params?: GetSalesPromptsRequest) =>
  useQuery({
    queryKey: salesQueryKeys.prompts(params),
    queryFn: () => getSalesPrompts(params),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    refetchInterval: 45_000,
    retry: 1,
    retryDelay: 800,
  });
