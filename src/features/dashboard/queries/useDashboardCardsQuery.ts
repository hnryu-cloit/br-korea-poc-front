import { useQuery } from "@tanstack/react-query";

import { getDashboardCards } from "@/features/dashboard/api/dashboard";
import { dashboardCardsMock } from "@/features/dashboard/mockdata/cards";
import { dashboardQueryKeys } from "@/features/dashboard/queries/queryKeys";
import type { DashboardOverviewRequest } from "@/features/dashboard/types/dashboard";

export function useDashboardCardsQuery(params: DashboardOverviewRequest) {
  return useQuery({
    queryKey: dashboardQueryKeys.cards(params),
    queryFn: () => getDashboardCards(params),
    select: () => dashboardCardsMock,
  });
}
