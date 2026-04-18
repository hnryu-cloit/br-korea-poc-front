import { StatsGrid } from "@/commons/components/page/page-layout";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";
import { SalesBottomSummaryCards } from "@/features/sales/components/SalesBottomSummaryCards";
import { SalesBreakdownTab } from "@/features/sales/components/SalesBreakdownTab";
import { SalesBreakEvenSection } from "@/features/sales/components/SalesBreakEvenSection";
import { SalesHeroSection } from "@/features/sales/components/SalesHeroSection";
import { SalesProductsTab } from "@/features/sales/components/SalesProductsTab";
import { SalesProfitTab } from "@/features/sales/components/SalesProfitTab";
import { SalesQueryTab } from "@/features/sales/components/SalesQueryTab";
import { SalesQuickQuestionsPanel } from "@/features/sales/components/SalesQuickQuestionsPanel";
import { SalesStoreContextCard } from "@/features/sales/components/SalesStoreContextCard";
import { SalesTabs } from "@/features/sales/components/SalesTabs";
import { useSalesScreen } from "@/features/sales/hooks/useSalesScreen";

export function SalesPage() {
  const { user } = useDemoSession();
  const {
    tab,
    setTab,
    query,
    setQuery,
    responses,
    showChat,
    setShowChat,
    handleSubmit,
    isSubmitting,
    todayRevenue,
    stats,
    weeklyData,
    productData,
    suggestedQuestions,
    quickQuestions,
    estimatedTodayProfit,
    avgMarginRate,
    avgNetProfitPerItem,
  } = useSalesScreen(user.storeId);

  return (
    <div className="space-y-6">
      <SalesHeroSection
        showChat={showChat}
        onToggleChat={() => setShowChat((value) => !value)}
        storeName={user.storeName}
      />

      {showChat ? <SalesQuickQuestionsPanel questions={quickQuestions} /> : null}

      <StatsGrid stats={stats} />

      <SalesBreakEvenSection
        todayRevenue={todayRevenue}
        estimatedTodayProfit={estimatedTodayProfit}
        avgMarginRate={avgMarginRate}
        avgNetProfitPerItem={avgNetProfitPerItem}
      />

      <SalesStoreContextCard storeName={user.storeName} />

      <section className="rounded-[28px] border border-border bg-white p-2 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <SalesTabs tab={tab} onChangeTab={setTab} />

        <div className="px-4 pb-4">
          {tab === "profit" ? <SalesProfitTab weeklyData={weeklyData} /> : null}
          {tab === "breakdown" ? <SalesBreakdownTab /> : null}
          {tab === "products" ? <SalesProductsTab products={productData} /> : null}
          {tab === "query" ? (
            <SalesQueryTab
              query={query}
              onChangeQuery={setQuery}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              suggestedQuestions={suggestedQuestions}
              responses={responses}
              storeName={user.storeName}
            />
          ) : null}
        </div>
      </section>

      <SalesBottomSummaryCards />
    </div>
  );
}
