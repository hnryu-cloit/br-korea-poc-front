import { useMemo, useState } from "react";

import { PAGE_CAPTIONS } from "@/commons/constants/field-captions";
import { AnalyticsDateRangeFilter } from "@/features/analytics/components/AnalyticsDateRangeFilter";
import { AnalyticsMetricsGrid } from "@/features/analytics/components/AnalyticsMetricsGrid";
import { SalesTrendChart } from "@/features/analytics/components/SalesTrendChart";
import { useGetAnalyticsMetricsQuery } from "@/features/analytics/queries/useGetAnalyticsMetricsQuery";
import { useGetAnalyticsSalesTrendQuery } from "@/features/analytics/queries/useGetAnalyticsSalesTrendQuery";
import type { AnalyticsSalesTrendCompareMode } from "@/features/analytics/types/analytics";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";
import { getDateRange } from "@/commons/utils/getDateRange";

function formatKoreanDateLabel(date: string) {
  if (!date) return "";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "";

  return `${parsedDate.getFullYear()}년 ${parsedDate.getMonth() + 1}월 ${parsedDate.getDate()}일`;
}

function formatWon(value?: number) {
  if (typeof value !== "number") return "-";
  return `₩ ${Math.round(value).toLocaleString("ko-KR")}원`;
}

export function AnalyticsScreen() {
  const { user, referenceDateTime } = useDemoSession();
  const [compareMode, setCompareMode] = useState<AnalyticsSalesTrendCompareMode>("prev_week");
  const { from: dateFrom, to: dateTo } = useMemo(
    () => getDateRange(referenceDateTime),
    [referenceDateTime],
  );
  const selectedRangeLabel = `(${formatKoreanDateLabel(dateFrom)} ~ ${formatKoreanDateLabel(dateTo)})`;

  const salesTrendQuery = useGetAnalyticsSalesTrendQuery({
    store_id: user.storeId,
    date_from: dateFrom,
    date_to: dateTo,
    compare_mode: compareMode,
  });

  const metricsQuery = useGetAnalyticsMetricsQuery({
    store_id: user.storeId,
    date_from: dateFrom,
    date_to: dateTo,
  });

  const metrics = metricsQuery.data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-[#41352E] text-[24px] font-bold">매출 현황</h2>
        <p className="mt-1 text-sm text-slate-500">{PAGE_CAPTIONS["analytics:sales"].subtitle}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[729fr_525fr] h-[104px]">
        <AnalyticsDateRangeFilter dateFrom={dateFrom} dateTo={dateTo} />

        <section className="rounded-[6px] border border-[#DADADA] bg-white px-8 py-6">
          <div className="flex h-full flex-col justify-between gap-4">
            <div className="flex items-center gap-2 text-[14px] leading-[18px]">
              <p className="font-medium text-[#653819]">선택 기간 총 매출</p>
              <p className="text-[#716862]">{selectedRangeLabel}</p>
            </div>
            <p className="text-[40px] font-bold leading-[1] text-[#41352E]">
              {metricsQuery.isLoading
                ? "조회 중..."
                : formatWon(metricsQuery.data?.selected_period_total_sales)}
            </p>
          </div>
        </section>
      </div>

      {/* {uniqueErrorMessages.length > 0 ? (
        <section className="rounded-[22px] border border-red-200 bg-red-50 px-5 py-4 text-sm">
          <p className="font-semibold text-red-700">실데이터를 불러오지 못했습니다.</p>
          <div className="mt-1 space-y-1 text-red-600">
            {uniqueErrorMessages.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        </section>
      ) : null} */}

      <SalesTrendChart
        data={salesTrendQuery.data}
        isLoading={salesTrendQuery.isLoading}
        compareMode={compareMode}
        onChangeCompareMode={setCompareMode}
      />

      <AnalyticsMetricsGrid metrics={metrics} />
    </div>
  );
}
