import { DateRangeFilter } from "@/commons/components/input/DateRangeFilter";
import { RadioFieldset } from "@/commons/components/input/RadioFieldset";
import type {
  SalesAggregationMode,
  SalesDateComparisonMode,
} from "@/features/sales/hooks/useSalesScreenV2";

export const SalesDateRangeFilter = ({
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
  dateComparisonMode: SalesDateComparisonMode;
  aggregationMode: SalesAggregationMode;
  onChangeDateFrom: (value: string) => void;
  onChangeDateTo: (value: string) => void;
  onChangeDateComparisonMode: (value: SalesDateComparisonMode) => void;
  onChangeAggregationMode: (value: SalesAggregationMode) => void;
}) => {
  return (
    <section className="rounded-[16px] border border-[#DADADA] bg-white px-6 py-5">
      <div className="flex gap-5">
        <DateRangeFilter
          dateFrom={dateFrom}
          dateTo={dateTo}
          onChangeDateFrom={onChangeDateFrom}
          onChangeDateTo={onChangeDateTo}
          dateToDisabled={dateComparisonMode === "daily"}
        />
        <RadioFieldset
          legend="비교 기준"
          name="sales-date-comparison-mode"
          value={dateComparisonMode}
          options={[
            { label: "일별 비교", value: "daily" },
            { label: "기간별 비교", value: "period" },
          ]}
          onChange={onChangeDateComparisonMode}
        />

        <RadioFieldset
          legend="집계 단위"
          name="sales-aggregation-mode"
          value={aggregationMode}
          options={[
            { label: "주간 비교", value: "weekly" },
            { label: "월간 비교", value: "monthly" },
          ]}
          onChange={onChangeAggregationMode}
        />
      </div>
    </section>
  );
};
