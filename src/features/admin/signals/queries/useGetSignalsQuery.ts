import { useQuery } from "@tanstack/react-query";

import { getSignals } from "@/features/admin/signals/api/signals";
import { signalsQueryKeys } from "@/features/admin/signals/queries/signalsQueryKeys";

export const useGetSignalsQuery = () =>
  useQuery({
    queryKey: signalsQueryKeys.list(),
    queryFn: getSignals,
    refetchInterval: 30_000,
  });