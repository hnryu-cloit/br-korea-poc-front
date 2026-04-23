import { DashboardNotices } from "@/features/dashboard/components/DashboardNotices";
import { DashboardSchedulePanel } from "@/features/dashboard/components/DashboardSchedulePanel";
import { SummaryCardsSection } from "@/features/dashboard/components/SummaryCardsSection";
import { DashboardAlertSummary } from "@/features/dashboard/components/DashboardAlertSummary";
import { useGetDashboardAlertsQuery } from "@/features/dashboard/queries/useGetDashboardAlertsQuery";
import { useGetDashboardNoticesQuery } from "@/features/dashboard/queries/useGetDashboardNoticesQuery";
import { useGetDashboardSummaryCardsQuery } from "@/features/dashboard/queries/useGetDashboardSummaryCardsQuery";
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
  const { data: noticesData } = useGetDashboardNoticesQuery(params);
  const { data: scheduleData, isLoading: scheduleLoading } = useGetHomeScheduleQuery(params);
  const { data: alertsData } = useGetDashboardAlertsQuery(params);
  const { data: summaryCardsData } = useGetDashboardSummaryCardsQuery(params);

  return (
    <div className="flex flex-col gap-6">
      <DashboardNotices notices={noticesData?.items ?? []} />
      <DashboardSchedulePanel
        storeId={user.storeId}
        events={scheduleData?.calendar_events ?? []}
        todos={scheduleData?.todos ?? []}
        isLoading={scheduleLoading && !scheduleData}
      />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-2xl text-brown-700 font-bold">운영 현황</span>
          <span className="text-md text-[#716862]">
            업데이트 시간:{" "}
            {summaryCardsData?.updated_at
              ? dayjs(summaryCardsData.updated_at).format("YYYY-MM-DD HH:mm")
              : "-"}
          </span>
        </div>
        <DashboardAlertSummary
          lowStockProducts={alertsData?.low_stock_products ?? []}
          orderDeadline={alertsData?.order_deadline ?? null}
        />
        <SummaryCardsSection
          cards={summaryCardsData?.cards ?? []}
          updatedAt={summaryCardsData?.updated_at}
        />
      </div>
    </div>
  );
}
