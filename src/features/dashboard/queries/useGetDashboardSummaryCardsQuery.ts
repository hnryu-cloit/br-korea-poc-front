import { useQuery } from "@tanstack/react-query";

import { getDashboardSummaryCards } from "@/features/dashboard/api/dashboard";
import { dashboardQueryKeys } from "@/features/dashboard/queries/dashboardQueryKeys";
import type { DashboardHomeRequest } from "@/features/dashboard/types/dashboard";

export function useGetDashboardSummaryCardsQuery(params: DashboardHomeRequest) {
  return useQuery({
    queryKey: dashboardQueryKeys.summaryCards(params),
    queryFn: () => getDashboardSummaryCards(params),
    staleTime: 5 * 60 * 1000,
  });
}
