import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

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
import { getSalesPrompts, getSalesSummary, postSalesQuery } from "@/features/sales/api/sales";
import type {
  SalesQueryHistoryItem,
  SalesTabKey,
} from "@/features/sales/types/sales-screen";
import { formatWon } from "@/features/sales/utils/format";

export function SalesPage() {
  const { user } = useDemoSession();
  const [tab, setTab] = useState<SalesTabKey>("profit");
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState<SalesQueryHistoryItem[]>([]);
  const [showChat, setShowChat] = useState(false);

  // 실 데이터 조회
  const { data: summary } = useQuery({
    queryKey: ["sales-summary"],
    queryFn: () => getSalesSummary(),
    staleTime: 60_000,
  });

  const { data: prompts } = useQuery({
    queryKey: ["sales-prompts"],
    queryFn: getSalesPrompts,
    staleTime: 300_000,
  });

  const queryMutation = useMutation({
    mutationFn: (prompt: string) => postSalesQuery(prompt, user.storeId),
    onSuccess: (data, prompt) => {
      const historyItem: SalesQueryHistoryItem = {
        query: prompt,
        answer: data.text ?? "",
        insights: data.actions ?? [],
        storeContext: data.store_context ?? "",
        dataSource: data.data_source ?? "",
        comparisonBasis: data.comparison_basis ?? "",
        calculationDate: data.calculation_date ?? "",
      };
      setResponses((current) => [historyItem, ...current]);
      setQuery("");
    },
  });

  const handleSubmit = () => {
    const value = query.trim();
    if (!value || queryMutation.isPending) return;
    queryMutation.mutate(value);
  };

  const todayRevenue = summary?.today_revenue ?? 0;
  const todayNetRevenue = summary?.today_net_revenue ?? 0;
  const dataDate = summary?.data_date;

  const stats = [
    {
      label: dataDate ? `매출 (${dataDate.slice(0, 4)}-${dataDate.slice(4, 6)}-${dataDate.slice(6, 8)})` : "최근 매출",
      value: formatWon(todayRevenue),
      tone: "default" as const,
    },
    {
      label: "순매출 (할인 후)",
      value: formatWon(todayNetRevenue),
      tone: "success" as const,
    },
    {
      label: "할인 금액",
      value: formatWon(todayRevenue - todayNetRevenue),
      tone: "danger" as const,
    },
    {
      label: "데이터 기준일",
      value: dataDate
        ? `${dataDate.slice(0, 4)}.${dataDate.slice(4, 6)}.${dataDate.slice(6, 8)}`
        : "조회 중",
      tone: "primary" as const,
    },
  ];

  const weeklyData = (summary?.weekly_data ?? []).map((d) => ({
    day: d.day,
    revenue: d.revenue,
    net_revenue: d.net_revenue,
  }));

  const productData = (summary?.top_products ?? []).map((p) => ({
    name: p.name,
    sales: p.sales,
    qty: p.qty,
  }));

  const suggestedQuestions = (prompts ?? []).map((p) => p.prompt);
  const quickQuestions = (prompts ?? []).slice(0, 4).map((p) => p.label);

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
        estimatedTodayProfit={summary?.estimated_today_profit ?? 0}
        avgMarginRate={summary?.avg_margin_rate ?? 0}
        avgNetProfitPerItem={summary?.avg_net_profit_per_item ?? 0}
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
              isSubmitting={queryMutation.isPending}
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