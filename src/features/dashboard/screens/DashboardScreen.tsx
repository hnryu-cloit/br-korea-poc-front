import { DashboardHero } from "@/features/dashboard/components/DashboardHero";
import { DashboardLoadingSkeleton } from "@/features/dashboard/components/DashboardLoadingSkeleton";
import { DashboardSchedulePanel } from "@/features/dashboard/components/DashboardSchedulePanel";
import { DashboardStatsTiles } from "@/features/dashboard/components/DashboardStatsTiles";
import { SummaryCardsSection } from "@/features/dashboard/components/SummaryCardsSection";
import { useDashboardOverviewQuery } from "@/features/dashboard/queries/useDashboardOverviewQuery";
import { useGetHomeScheduleQuery } from "@/features/dashboard/queries/useGetHomeScheduleQuery";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";
import dayjs from "dayjs";
import { DashboardBanner } from "../components/DashboardBanner";

export function DashboardPage() {
  const { user } = useDemoSession();
  const now = dayjs(new Date()).format("YYYY-MM-DD");
  const params = {
    store_id: user.storeId,
    business_date: now,
  };
  const overviewQuery = useDashboardOverviewQuery(params);
  const scheduleQuery = useGetHomeScheduleQuery(user.storeId);

  const stats = overviewQuery.data?.stats ?? [];
  const cards = overviewQuery.data?.cards ?? [];
  const isInitialLoading = overviewQuery.isLoading && !overviewQuery.data;

  return (
    <div className="space-y-6">
      <DashboardHero updatedAt={overviewQuery.data?.updated_at} />

      {isInitialLoading ? (
        <DashboardLoadingSkeleton />
      ) : (
        <>
          <DashboardSchedulePanel
            storeId={user.storeId}
            events={scheduleQuery.data?.events ?? []}
            todos={scheduleQuery.data?.todos ?? []}
            updatedAt={scheduleQuery.data?.updated_at}
            isLoading={scheduleQuery.isLoading}
          />
          <DashboardBanner notices={scheduleQuery.data?.notices ?? []} />
          <DashboardStatsTiles stats={stats} />
          <SummaryCardsSection cards={cards} />
        </>
      )}
    </div>
  );
}
