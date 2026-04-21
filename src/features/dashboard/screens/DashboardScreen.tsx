import { DashboardHero } from "@/features/dashboard/components/DashboardHero";
import { DashboardLoadingSkeleton } from "@/features/dashboard/components/DashboardLoadingSkeleton";
import { DashboardSchedulePanel } from "@/features/dashboard/components/DashboardSchedulePanel";
import { DashboardStatsTiles } from "@/features/dashboard/components/DashboardStatsTiles";
import { SummaryCardsSection } from "@/features/dashboard/components/SummaryCardsSection";
import { useGetDashboardOverviewQuery } from "@/features/dashboard/queries/useDashboardOverviewQuery";
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
  const { data: overviewData, isLoading: overviewLoading } = useGetDashboardOverviewQuery(params);
  const { data: scheduleData, isLoading: scheduleLoading } = useGetHomeScheduleQuery(user.storeId);

  const stats = overviewData?.stats ?? [];
  const cards = overviewData?.cards ?? [];
  const isInitialLoading = (overviewLoading && !overviewData) || (scheduleLoading && !scheduleData);

  return (
    <div className="space-y-6">
      <DashboardHero updatedAt={overviewData?.updated_at} />

      {isInitialLoading ? (
        <DashboardLoadingSkeleton />
      ) : (
        <>
          <DashboardSchedulePanel
            storeId={user.storeId}
            events={scheduleData?.events ?? []}
            todos={scheduleData?.todos ?? []}
            updatedAt={scheduleData?.updated_at}
            isLoading={scheduleLoading}
          />
          <DashboardBanner notices={scheduleData?.notices ?? []} />
          <DashboardStatsTiles stats={stats} />
          <SummaryCardsSection cards={cards} />
        </>
      )}
    </div>
  );
}
