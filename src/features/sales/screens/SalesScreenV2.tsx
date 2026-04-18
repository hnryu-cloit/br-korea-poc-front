import { PageHero, StatsGrid } from "@/commons/components/page/page-layout";
import { SalesV2ChatPanel } from "@/features/sales/components/SalesV2ChatPanel";
import { SalesV2ChartsSection } from "@/features/sales/components/SalesV2ChartsSection";
import { SalesDateRangeFilter } from "@/features/sales/components/SalesDateRangeFilter";
import { SalesV2InsightsSection } from "@/features/sales/components/SalesV2InsightsSection";
import { SalesV2OpportunitySection } from "@/features/sales/components/SalesV2OpportunitySection";
import { SALES_V2_QUERY_TYPE_LABEL } from "@/features/sales/constants/sales-v2";
import { useSalesScreenV2 } from "@/features/sales/hooks/useSalesScreenV2";

export const SalesScreenV2 = () => {
  const {
    dateFrom,
    dateTo,
    input,
    messages,
    bottomRef,
    opportunity,
    opportunityTab,
    insightSections,
    salesStats,
    suggestedPrompts,
    latestAssistantMessage,
    summaryData,
    insightsLoading,
    summaryLoading,
    promptsLoading,
    sending,
    setInput,
    sendMessage,
    handleChangeDateFrom,
    handleChangeDateTo,
    handleChangeOpportunityTab,
  } = useSalesScreenV2();

  return (
    <div className="space-y-6">
      <PageHero
        title="손익 분석"
        description={
          latestAssistantMessage?.queryType
            ? `최근 ${SALES_V2_QUERY_TYPE_LABEL[latestAssistantMessage.queryType] ?? latestAssistantMessage.queryType} 응답까지 반영해 보여드려요.`
            : "궁금한 것을 물어보시면 분석해 드려요."
        }
      />
      <StatsGrid stats={salesStats} />
      <SalesDateRangeFilter
        dateFrom={dateFrom}
        dateTo={dateTo}
        onChangeDateFrom={handleChangeDateFrom}
        onChangeDateTo={handleChangeDateTo}
      />

      <SalesV2InsightsSection
        sections={insightSections}
        isLoading={insightsLoading}
      />

      <SalesV2ChartsSection
        summary={summaryData}
        isLoading={summaryLoading}
        dateFrom={dateFrom}
        dateTo={dateTo}
      />

      <SalesV2OpportunitySection
        data={opportunity}
        activeTab={opportunityTab}
        onChangeTab={handleChangeOpportunityTab}
      />

      <section>
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
      </section>
    </div>
  );
};
