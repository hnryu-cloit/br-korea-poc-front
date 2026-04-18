import { useQuery } from "@tanstack/react-query";

import { getOrderingHistory } from "@/features/ordering/api/ordering";

export const useGetOrderingHistoryQuery = (storeId: string) =>
  useQuery({
    queryKey: ["ordering-history", storeId],
    queryFn: () => getOrderingHistory(storeId),
    enabled: !!storeId,
  });