import { DashboardHero } from "@/features/dashboard/components/DashboardHero";
import { DashboardLoadingSkeleton } from "@/features/dashboard/components/DashboardLoadingSkeleton";
import { InsightsSection } from "@/features/dashboard/components/InsightsSection";
import { PriorityActionsSection } from "@/features/dashboard/components/PriorityActionsSection";
import { DashboardStatsTiles } from "@/features/dashboard/components/DashboardStatsTiles";
import { SummaryCardsSection } from "@/features/dashboard/components/SummaryCardsSection";
import { useDashboardOverviewQuery } from "@/features/dashboard/queries/useDashboardOverviewQuery";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";
import dayjs from "dayjs";
import { INSIGHTS } from "../mockdata/insights";

export function DashboardPage() {
  const { user } = useDemoSession();
  const now = dayjs(new Date()).format("YYYY-MM-DD");
  const params = {
    store_id: user.storeId,
    business_date: now,
  };
  const overviewQuery = useDashboardOverviewQuery(params);

  const priorityActions = overviewQuery.data?.priority_actions ?? [];
  const stats = overviewQuery.data?.stats ?? [];
  const cards = overviewQuery.data?.cards ?? [];
  const isInitialLoading = overviewQuery.isLoading && !overviewQuery.data;
  const isRefreshing = overviewQuery.isFetching && !isInitialLoading;

  return (
    <div className="space-y-6">
      <DashboardHero updatedAt={overviewQuery.data?.updated_at} />
      {isRefreshing ? (
        <div className="inline-flex items-center gap-2 rounded-full border border-[#dce4f3] bg-[#f7faff] px-3 py-1 text-xs font-semibold text-[#2454C8]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#2454C8]" />
          데이터 요청 중...
        </div>
      ) : null}

      {isInitialLoading ? (
        <DashboardLoadingSkeleton />
      ) : (
        <>
          <PriorityActionsSection actions={priorityActions} />
          <DashboardStatsTiles stats={stats} />
          <SummaryCardsSection cards={cards} />
        </>
      )}
      <InsightsSection insights={INSIGHTS} />
    </div>
  );
}
