import { InfoPopover } from "@/commons/components/info/InfoPopover";
import { FIELD_CAPTIONS, PAGE_CAPTIONS } from "@/commons/constants/field-captions";
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

function updateTime(referenceDateTime: string) {
  const date = dayjs(referenceDateTime);
  if (!date.isValid()) return "-";

  const hour = date.hour();
  const minute = date.minute();

  // 오후 11시 이후(23:01 포함)부터 오픈 전(06:59 포함)까지는 마지막 마감 시각인 오후 11시로 고정
  if (hour < 7) {
    return date.subtract(1, "day").hour(23).minute(0).format("YYYY-MM-DD A hh시");
  }

  if (hour === 23 && minute > 0) {
    return date.hour(23).minute(0).format("YYYY-MM-DD A hh시");
  }

  return date.format("YYYY-MM-DD A hh시");
}

export function DashboardScreen() {
  const { user, referenceDateTime } = useDemoSession();
  const businessDate = dayjs(referenceDateTime).format("YYYY-MM-DD");
  const selectedDate = dayjs(referenceDateTime).toDate();
  const params = {
    store_id: user.storeId,
    business_date: businessDate,
  };
  const {
    data: noticesData,
    isLoading: noticesLoading,
    isFetching: noticesFetching,
  } = useGetDashboardNoticesQuery(params);
  const { data: scheduleData, isLoading: scheduleLoading } = useGetHomeScheduleQuery(params);
  const { data: alertsData } = useGetDashboardAlertsQuery(params);
  const { data: summaryCardsData } = useGetDashboardSummaryCardsQuery(params);

  return (
    <div className="flex flex-col gap-6">
      <DashboardNotices
        notices={noticesData?.items ?? []}
        isLoading={noticesLoading || noticesFetching}
      />
      <DashboardSchedulePanel
        storeId={user.storeId}
        events={scheduleData?.calendar_events ?? []}
        scheduleEvents={scheduleData?.daily_events ?? []}
        todos={scheduleData?.todos ?? []}
        referenceDate={selectedDate}
        selectedDate={selectedDate}
        isLoading={scheduleLoading && !scheduleData}
      />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-2xl text-brown-700 font-bold">운영 현황</span>
          <span className="text-sm text-slate-500">{PAGE_CAPTIONS["dashboard"].subtitle}</span>
          <span className="inline-flex items-center gap-1.5 text-md text-[#716862]">
            <span>
              업데이트 시간:
              {updateTime(referenceDateTime)}
            </span>
            <InfoPopover
              caption={FIELD_CAPTIONS["dashboard:update_schedule"]}
              side="bottom"
              align="left"
            />
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
