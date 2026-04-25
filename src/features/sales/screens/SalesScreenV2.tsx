import { SalesDateRangeFilter } from "@/features/sales/components/SalesDateRangeFilter";
import { SalesV2ChartsSection } from "@/features/sales/components/SalesV2ChartsSection";
import { SalesV2InsightsSection } from "@/features/sales/components/SalesV2InsightsSection";
import { SalesV2OpportunitySection } from "@/features/sales/components/SalesV2OpportunitySection";
import { useSalesScreenV2 } from "@/features/sales/hooks/useSalesScreenV2";

export const SalesScreenV2 = () => {
  const {
    dateFrom,
    dateTo,
    dateComparisonMode,
    aggregationMode,
    opportunity,
    opportunityTab,
    insightSections,
    latestAssistantMessage,
    summaryData,
    salesErrorMessages,
    insightsLoading,
    summaryLoading,
    handleChangeDateFrom,
    handleChangeDateTo,
    handleChangeDateComparisonMode,
    handleChangeAggregationMode,
    handleChangeOpportunityTab,
  } = useSalesScreenV2();

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

      {opportunity ? (
        <SalesV2OpportunitySection
          data={opportunity}
          activeTab={opportunityTab}
          onChangeTab={handleChangeOpportunityTab}
        />
      ) : null}

      {/* <section>
        <SalesV2ChatPanel
          messages={messages}
          prompts={suggestedPrompts}
          promptsLoading={promptsLoading}
          input={input}
          loading={sending}
          bottomRef={bottomRef}
          onChangeInput={setInput}
          onSelectPrompt={sendMessage}
          onSubmitInput={() => sendMessage(input)}
        />
      </section> */}
    </div>
  );
};
