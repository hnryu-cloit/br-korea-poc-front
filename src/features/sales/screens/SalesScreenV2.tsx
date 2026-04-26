import { SalesDateRangeFilter } from "@/features/sales/components/SalesDateRangeFilter";
// import { SalesV2CampaignActivitySection } from "@/features/sales/components/SalesV2CampaignActivitySection";
import { SalesV2ChartsSection } from "@/features/sales/components/SalesV2ChartsSection";
import { SalesV2HourlyChannelChart } from "@/features/sales/components/SalesV2HourlyChannelChart";
import { SalesV2InsightsSection } from "@/features/sales/components/SalesV2InsightsSection";
import { SalesV2OpportunitySection } from "@/features/sales/components/SalesV2OpportunitySection";
import { useSalesScreenV2 } from "@/features/sales/hooks/useSalesScreenV2";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";

function SalesScreenV2Content() {
  const {
    dateFrom,
    dateTo,
    dateComparisonMode,
    aggregationMode,
    opportunity,
    opportunityTab,
    insightSections,
    summaryData,
    hourlyChannelItems,
    hourlyChannelLoading,
    insightsLoading,
    summaryLoading,
    handleChangeDateFrom,
    handleChangeDateTo,
    handleChangeDateComparisonMode,
    handleChangeAggregationMode,
    handleChangeOpportunityTab,
  } = useSalesScreenV2();
  const opportunityLoading = insightsLoading || summaryLoading;

  return (
    <div className="space-y-6">
      <h2 className="text-[#41352E] text-[24px] font-bold">손익 분석</h2>

      <SalesDateRangeFilter
        dateFrom={dateFrom}
        dateTo={dateTo}
        dateComparisonMode={dateComparisonMode}
        aggregationMode={aggregationMode}
        onChangeDateFrom={handleChangeDateFrom}
        onChangeDateTo={handleChangeDateTo}
        onChangeDateComparisonMode={handleChangeDateComparisonMode}
        onChangeAggregationMode={handleChangeAggregationMode}
      />

      <SalesV2InsightsSection sections={insightSections} isLoading={insightsLoading} />

      <SalesV2ChartsSection
        summary={summaryData}
        isLoading={summaryLoading}
        dateFrom={dateFrom}
        dateTo={dateTo}
      />

      <SalesV2HourlyChannelChart
        items={hourlyChannelItems}
        isLoading={hourlyChannelLoading}
        dateFrom={dateFrom}
        dateTo={dateTo}
      />

      <SalesV2OpportunitySection
        data={opportunity}
        activeTab={opportunityTab}
        onChangeTab={handleChangeOpportunityTab}
        isLoading={opportunityLoading}
      />
    </div>
  );
}

export const SalesScreenV2 = () => {
  const { referenceDateTime } = useDemoSession();

  return <SalesScreenV2Content key={referenceDateTime} />;
};
