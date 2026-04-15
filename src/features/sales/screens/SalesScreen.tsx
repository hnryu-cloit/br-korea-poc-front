import { useMemo, useState } from "react";

import { StatsGrid } from "@/commons/components/page/page-layout";
import { SalesBottomSummaryCards } from "@/features/sales/components/SalesBottomSummaryCards";
import { SalesBreakdownTab } from "@/features/sales/components/SalesBreakdownTab";
import { SalesBreakEvenSection } from "@/features/sales/components/SalesBreakEvenSection";
import {
  createMockSalesQueryHistoryItem,
  productData,
  quickQuestions,
  suggestedQuestions,
  weeklyData,
} from "@/features/sales/mockdata/sales-screen";
import type {
  SalesQueryHistoryItem,
  SalesTabKey,
} from "@/features/sales/types/sales-screen";
import { formatWon } from "@/features/sales/utils/format";
import { SalesHeroSection } from "@/features/sales/components/SalesHeroSection";
import { SalesProductsTab } from "@/features/sales/components/SalesProductsTab";
import { SalesProfitTab } from "@/features/sales/components/SalesProfitTab";
import { SalesQueryTab } from "@/features/sales/components/SalesQueryTab";
import { SalesQuickQuestionsPanel } from "@/features/sales/components/SalesQuickQuestionsPanel";
import { SalesStoreContextCard } from "@/features/sales/components/SalesStoreContextCard";
import { SalesTabs } from "@/features/sales/components/SalesTabs";

export function SalesPage() {
  const [tab, setTab] = useState<SalesTabKey>("profit");
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState<SalesQueryHistoryItem[]>([]);
  const [showChat, setShowChat] = useState(false);

  const todayRevenue = 1850000;
  const todayCost = 1508000;
  const todayProfit = 342000;
  const breakEvenPoint = 1620000;
  const targetProfit = 500000;
  const itemsNeeded = Math.ceil((targetProfit - todayProfit) / 6800);

  const stats = useMemo(
    () => [
      { label: "오늘 매출", value: formatWon(todayRevenue), tone: "default" as const },
      { label: "오늘 순이익", value: `+${todayProfit.toLocaleString()}원`, tone: "success" as const },
      { label: "총 비용", value: formatWon(todayCost), tone: "danger" as const },
      { label: "손익분기점", value: "달성", tone: "primary" as const },
    ],
    [],
  );

  const handleSubmit = () => {
    const value = query.trim();
    if (!value) return;

    setResponses((current) => [createMockSalesQueryHistoryItem(value), ...current]);
    setQuery("");
  };

  return (
    <div className="space-y-6">
      <SalesHeroSection
        showChat={showChat}
        onToggleChat={() => setShowChat((value) => !value)}
      />

      {showChat ? <SalesQuickQuestionsPanel questions={quickQuestions} /> : null}

      <StatsGrid stats={stats} />

      <SalesBreakEvenSection
        breakEvenPoint={breakEvenPoint}
        todayProfit={todayProfit}
        todayRevenue={todayRevenue}
        targetProfit={targetProfit}
        itemsNeeded={itemsNeeded}
      />

      <SalesStoreContextCard />

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
              suggestedQuestions={suggestedQuestions}
              responses={responses}
            />
          ) : null}
        </div>
      </section>

      <SalesBottomSummaryCards />
    </div>
  );
}
