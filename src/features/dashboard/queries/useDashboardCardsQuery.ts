import { useQuery } from "@tanstack/react-query";

import { fetchDashboardCards } from "@/features/dashboard/api";
import { dashboardCardsMock } from "@/features/dashboard/mockdata/cards";
import { dashboardQueryKeys } from "@/features/dashboard/queries/queryKeys";
import type { DashboardOverviewRequest } from "@/features/dashboard/type/dashboard";

export function useDashboardCardsQuery(params: DashboardOverviewRequest) {
  return useQuery({
    queryKey: dashboardQueryKeys.cards(params),
    queryFn: () => fetchDashboardCards(params),
    select: () => dashboardCardsMock,
  });
}
