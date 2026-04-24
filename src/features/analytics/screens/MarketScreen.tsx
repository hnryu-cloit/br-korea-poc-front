import { useState } from "react";
import { AlertCircle, Download } from "lucide-react";

import { useMarketScreen } from "@/features/analytics/hooks/useMarketScreen";

import {
  AnalysisScopeFilterBar,
  type AnalysisScope,
} from "@/features/analytics/components/AnalysisScopeFilterBar";
import { PageHero } from "@/commons/components/page/page-layout";
import { HQMarketOverviewSection } from "@/features/analytics/components/HQMarketOverviewSection";
import { MarketActionGuideSection } from "@/features/analytics/components/MarketActionGuideSection";
import { MarketCustomerSection } from "@/features/analytics/components/MarketCustomerSection";
import { MarketInsightBoardSection } from "@/features/analytics/components/MarketInsightBoardSection";
import { MarketIntelligenceSection } from "@/features/analytics/components/MarketIntelligenceSection";
import { MarketOverviewCardsSection } from "@/features/analytics/components/MarketOverviewCardsSection";
import { MarketStoreProfileSection } from "@/features/analytics/components/MarketStoreProfileSection";
import { SalesTrendChart } from "@/features/analytics/components/SalesTrendChart";
import { useGetAnalyticsCustomerProfileQuery } from "@/features/analytics/queries/useGetAnalyticsCustomerProfileQuery";
import { useGetAnalyticsMarketInsightsQuery } from "@/features/analytics/queries/useGetAnalyticsMarketInsightsQuery";
import { useGetHqAnalyticsMarketInsightsQuery } from "@/features/analytics/queries/useGetHqAnalyticsMarketInsightsQuery";
import { useGetAnalyticsMarketIntelligenceQuery } from "@/features/analytics/queries/useGetAnalyticsMarketIntelligenceQuery";
import { useGetAnalyticsSalesTrendQuery } from "@/features/analytics/queries/useGetAnalyticsSalesTrendQuery";
import { useGetAnalyticsStoreProfileQuery } from "@/features/analytics/queries/useGetAnalyticsStoreProfileQuery";
import { formatWonCompact } from "@/features/analytics/utils/market";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";

export function MarketScreen() {
  const { user } = useDemoSession();
  const [scope, setScope] = useState<AnalysisScope>({
    gu: "전체",
    dong: "전체",
    industry: "전체",
    year: "2026",
    quarter: "Q1",
    radiusMeters: 3000,
  });

  const storeProfileQuery = useGetAnalyticsStoreProfileQuery(user.storeId);
  const customerProfileQuery = useGetAnalyticsCustomerProfileQuery(user.storeId);
  const salesTrendQuery = useGetAnalyticsSalesTrendQuery({ store_id: user.storeId });
  const marketIntelligenceQuery = useGetAnalyticsMarketIntelligenceQuery({
    store_id: user.storeId,
    gu: scope.gu,
    dong: scope.dong,
    industry: scope.industry,
    year: Number(scope.year),
    quarter: scope.quarter,
    radius_m: scope.radiusMeters,
  });
  const marketInsightsQuery = useGetAnalyticsMarketInsightsQuery({
    store_id: user.storeId,
    gu: scope.gu,
    dong: scope.dong,
    industry: scope.industry,
    year: Number(scope.year),
    quarter: scope.quarter,
    radius_m: scope.radiusMeters,
  });
  const hqInsightsQuery = useGetHqAnalyticsMarketInsightsQuery(
    {
      gu: scope.gu,
      dong: scope.dong,
      industry: scope.industry,
      year: Number(scope.year),
      quarter: scope.quarter,
      radius_m: scope.radiusMeters,
      limit: 30,
    },
    user.role === "hq_admin",
  );
  const isLoading =
    storeProfileQuery.isLoading ||
    customerProfileQuery.isLoading ||
    salesTrendQuery.isLoading ||
    marketIntelligenceQuery.isLoading ||
    marketInsightsQuery.isLoading ||
    hqInsightsQuery.isLoading;
  const hasError = marketIntelligenceQuery.isError;
  const storeProfile = storeProfileQuery.data;
  const customerProfile = customerProfileQuery.data;
  const salesTrend = salesTrendQuery.data;
  const storeInsights = marketInsightsQuery.data;
  const hqInsights = hqInsightsQuery.data;

  const { isDownloading, handleDownloadWeeklyReport } = useMarketScreen(scope, user.storeId);

  const heroDescription = storeProfile
    ? `${storeProfile.sido} ${storeProfile.region} · 유사 매장 ${storeProfile.peer_count}개 · 추정 매출 ${formatWonCompact(storeProfile.actual_sales_amt)}`
    : "우리 매장 상권 특성과 주요 고객 유형을 확인합니다.";

  return (
    <div className="space-y-6">
      <PageHero
        title="상권·고객 분석"
        description={`${heroDescription} · ${scope.year} ${scope.quarter} · 반경 ${scope.radiusMeters.toLocaleString()}m`}
      />

      <AnalysisScopeFilterBar value={scope} onChange={setScope} />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleDownloadWeeklyReport}
          disabled={isDownloading}
          className="inline-flex items-center gap-2 rounded-lg border border-[#2c61d6] bg-white px-3 py-2 text-sm font-semibold text-[#2c61d6] hover:bg-[#edf3ff] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          {isDownloading ? "PDF 생성 중..." : "주간 분석 리포트 PDF 다운로드"}
        </button>
      </div>

      {hasError ? (
        <section className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            분석 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
          </div>
        </section>
      ) : null}

      <MarketOverviewCardsSection
        storeProfile={storeProfile}
        customerProfile={customerProfile}
        isLoading={isLoading}
      />

      <MarketIntelligenceSection
        data={marketIntelligenceQuery.data}
        isLoading={marketIntelligenceQuery.isLoading}
      />

      <SalesTrendChart
        data={salesTrend}
        isLoading={salesTrendQuery.isLoading}
        compareMode={salesTrend?.compare_mode ?? "prev_month"}
        onChangeCompareMode={() => {}}
      />

      <MarketInsightBoardSection
        storeProfile={storeProfile}
        customerProfile={customerProfile}
        salesTrend={salesTrend}
        aiInsights={storeInsights?.key_insights}
        source={storeInsights?.source}
        isLoading={isLoading}
      />

      {user.role === "hq_admin" ? (
        <HQMarketOverviewSection data={hqInsights} isLoading={hqInsightsQuery.isLoading} />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1.4fr]">
        <MarketStoreProfileSection data={storeProfile} isLoading={storeProfileQuery.isLoading} />
        <MarketCustomerSection data={customerProfile} isLoading={customerProfileQuery.isLoading} />
      </div>

      <MarketActionGuideSection
        storeProfile={storeProfile}
        customerProfile={customerProfile}
        aiActionPlan={storeInsights?.action_plan}
        source={storeInsights?.source}
        isLoading={isLoading}
      />
    </div>
  );
}
