import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { postSalesQuery } from "@/features/sales/api/sales";
import { useGetSalesPromptsQuery } from "@/features/sales/queries/useGetSalesPromptsQuery";
import { useGetSalesSummaryQuery } from "@/features/sales/queries/useGetSalesSummaryQuery";
import type {
  SalesQueryHistoryItem,
  SalesTabKey,
} from "@/features/sales/types/sales-screen";
import {
  toQuickQuestions,
  toSalesProductData,
  toSalesQueryHistoryItem,
  toSalesStats,
  toSalesWeeklyData,
  toSuggestedQuestions,
} from "@/features/sales/utils/sales-screen";

export const useSalesScreen = (storeId?: string) => {
  const [tab, setTab] = useState<SalesTabKey>("profit");
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState<SalesQueryHistoryItem[]>([]);
  const [showChat, setShowChat] = useState(false);

  const summaryQuery = useGetSalesSummaryQuery(storeId ? { store_id: storeId } : undefined);
  const promptsQuery = useGetSalesPromptsQuery(storeId ? { store_id: storeId } : undefined);

  const queryMutation = useMutation({
    mutationFn: (prompt: string) => postSalesQuery(prompt, storeId, "sales"),
    onSuccess: (data, prompt) => {
      setResponses((current) => [toSalesQueryHistoryItem(prompt, data), ...current]);
      setQuery("");
    },
  });

  const summary = summaryQuery.data;
  const todayRevenue = summary?.today_revenue ?? 0;

  const handleSubmit = () => {
    const value = query.trim();
    if (!value || queryMutation.isPending) return;
    queryMutation.mutate(value);
  };

  return {
    tab,
    setTab,
    query,
    setQuery,
    responses,
    showChat,
    setShowChat,
    handleSubmit,
    isSubmitting: queryMutation.isPending,
    todayRevenue,
    stats: useMemo(() => toSalesStats(summary), [summary]),
    weeklyData: useMemo(() => toSalesWeeklyData(summary), [summary]),
    productData: useMemo(() => toSalesProductData(summary), [summary]),
    suggestedQuestions: useMemo(
      () => toSuggestedQuestions(promptsQuery.data),
      [promptsQuery.data],
    ),
    quickQuestions: useMemo(
      () => toQuickQuestions(promptsQuery.data),
      [promptsQuery.data],
    ),
    estimatedTodayProfit: summary?.estimated_today_profit ?? 0,
    avgMarginRate: summary?.avg_margin_rate ?? 0,
    avgNetProfitPerItem: summary?.avg_net_profit_per_item ?? 0,
  };
};
