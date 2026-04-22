import { DashboardNotices } from "@/features/dashboard/components/DashboardNotices";
import { DashboardSchedulePanel } from "@/features/dashboard/components/DashboardSchedulePanel";
import { SummaryCardsSection } from "@/features/dashboard/components/SummaryCardsSection";
import { DashboardAlertSummary } from "@/features/dashboard/components/DashboardAlertSummary";
import { useGetDashboardOverviewQuery } from "@/features/dashboard/queries/useDashboardOverviewQuery";
import { useGetHomeScheduleQuery } from "@/features/dashboard/queries/useGetHomeScheduleQuery";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";
import dayjs from "dayjs";

export function DashboardScreen() {
  const { user } = useDemoSession();
  const now = dayjs(new Date()).format("YYYY-MM-DD");
  const params = {
    store_id: user.storeId,
    business_date: now,
  };
  const { data: overviewData } = useGetDashboardOverviewQuery(params);
  const { data: scheduleData, isLoading: scheduleLoading } = useGetHomeScheduleQuery(user.storeId);

  const cards = overviewData?.cards ?? [];

  return (
    <div className="flex flex-col">
      <DashboardNotices notices={scheduleData?.notices ?? []} />
      <DashboardSchedulePanel
        storeId={user.storeId}
        events={scheduleData?.events ?? []}
        todos={scheduleData?.todos ?? []}
        updatedAt={scheduleData?.updated_at}
        isLoading={scheduleLoading && !scheduleData}
      />
      <div className="p-[32px_24px]">
        <DashboardAlertSummary />
        <SummaryCardsSection cards={cards} />
      </div>
    </div>
  );
}
