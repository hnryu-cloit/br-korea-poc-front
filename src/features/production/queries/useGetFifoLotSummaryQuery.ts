import { useQuery } from "@tanstack/react-query";

import { getFifoLotSummary } from "@/features/production/api/production";
import { productionQueryKeys } from "@/features/production/queries/productionQueryKeys";
import type { FifoLotType } from "@/features/production/types/production";

export const useGetFifoLotSummaryQuery = (
  storeId: string,
  lotType?: FifoLotType,
  page = 1,
  pageSize = 20,
  enabled = true,
  date?: string,
) =>
  useQuery({
    queryKey: productionQueryKeys.fifoLots(storeId, lotType, page, pageSize, date ?? ""),
    queryFn: () => getFifoLotSummary(storeId, lotType, page, pageSize, date),
    enabled: !!storeId && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
