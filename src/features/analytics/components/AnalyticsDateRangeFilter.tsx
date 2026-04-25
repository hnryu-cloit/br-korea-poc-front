import { DateRangeFilter } from "@/commons/components/input/DateRangeFilter";
import { RadioFieldset } from "@/commons/components/input/RadioFieldset";
import { FIELD_CAPTIONS } from "@/commons/constants/field-captions";

export type AnalyticsDateComparisonMode = "daily" | "period";
export type AnalyticsAggregationMode = "weekly" | "monthly";

export const AnalyticsDateRangeFilter = ({
  dateFrom,
  dateTo,
  dateComparisonMode,
  aggregationMode,
  onChangeDateFrom,
  onChangeDateTo,
  onChangeDateComparisonMode,
  onChangeAggregationMode,
}: {
  dateFrom: string;
  dateTo: string;
  dateComparisonMode: AnalyticsDateComparisonMode;
  aggregationMode: AnalyticsAggregationMode;
  onChangeDateFrom: (value: string) => void;
  onChangeDateTo: (value: string) => void;
  onChangeDateComparisonMode: (value: AnalyticsDateComparisonMode) => void;
  onChangeAggregationMode: (value: AnalyticsAggregationMode) => void;
}) => {
  return (
    <section className="rounded-[16px] border border-[#DADADA] bg-white px-6 py-5">
      <div className="flex flex-col gap-4">
        <DateRangeFilter
          dateFrom={dateFrom}
          dateTo={dateTo}
          onChangeDateFrom={onChangeDateFrom}
          onChangeDateTo={onChangeDateTo}
          showDateTo={dateComparisonMode === "period"}
        />
        <div className="flex flex-wrap gap-4">
          <RadioFieldset
            legend="비교 기준"
            name="analytics-date-comparison-mode"
            value={dateComparisonMode}
            options={[
              { label: "일별 비교", value: "daily" },
              { label: "기간별 비교", value: "period" },
            ]}
            onChange={onChangeDateComparisonMode}
          />
          <RadioFieldset
            legend="집계 단위"
            name="analytics-aggregation-mode"
            value={aggregationMode}
            options={[
              {
                label: "주간 비교",
                value: "weekly",
                caption: FIELD_CAPTIONS["analytics:weekly_comparison"],
              },
              {
                label: "월간 비교",
                value: "monthly",
                caption: FIELD_CAPTIONS["analytics:monthly_comparison"],
              },
            ]}
            onChange={onChangeAggregationMode}
          />
        </div>
      </div>
    </section>
  );
};
