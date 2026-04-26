import { useQuery } from "@tanstack/react-query";

import { getSalesHourlyChannel } from "@/features/sales/api/sales";
import { salesQueryKeys } from "@/features/sales/queries/salesQueryKeys";
import type { GetSalesInsightsRequest } from "@/features/sales/types/sales";

export const useGetSalesHourlyChannelQuery = (params?: GetSalesInsightsRequest) =>
  useQuery({
    queryKey: salesQueryKeys.hourlyChannel(params),
    queryFn: () => getSalesHourlyChannel(params),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    refetchInterval: 60_000,
    retry: 1,
    retryDelay: 800,
  });
