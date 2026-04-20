import { AlertCircle } from "lucide-react";

import { PageHero } from "@/commons/components/page/page-layout";
import { MarketActionGuideSection } from "@/features/analytics/components/MarketActionGuideSection";
import { MarketCustomerSection } from "@/features/analytics/components/MarketCustomerSection";
import { MarketInsightBoardSection } from "@/features/analytics/components/MarketInsightBoardSection";
import { MarketOverviewCardsSection } from "@/features/analytics/components/MarketOverviewCardsSection";
import { MarketStoreProfileSection } from "@/features/analytics/components/MarketStoreProfileSection";
import { SalesTrendChart } from "@/features/analytics/components/SalesTrendChart";
import { useGetAnalyticsCustomerProfileQuery } from "@/features/analytics/queries/useGetAnalyticsCustomerProfileQuery";
import { useGetAnalyticsSalesTrendQuery } from "@/features/analytics/queries/useGetAnalyticsSalesTrendQuery";
import { useGetAnalyticsStoreProfileQuery } from "@/features/analytics/queries/useGetAnalyticsStoreProfileQuery";
import { formatWonCompact } from "@/features/analytics/utils/market";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";

export function MarketScreen() {
  const { user } = useDemoSession();
  const storeProfileQuery = useGetAnalyticsStoreProfileQuery(user.storeId);
  const customerProfileQuery = useGetAnalyticsCustomerProfileQuery(user.storeId);
  const salesTrendQuery = useGetAnalyticsSalesTrendQuery(user.storeId);
  const isLoading =
    storeProfileQuery.isLoading || customerProfileQuery.isLoading || salesTrendQuery.isLoading;
  const hasError =
    storeProfileQuery.isError || customerProfileQuery.isError || salesTrendQuery.isError;
  const storeProfile = storeProfileQuery.data;
  const customerProfile = customerProfileQuery.data;
  const salesTrend = salesTrendQuery.data;

  const heroDescription = storeProfile
    ? `${storeProfile.sido} ${storeProfile.region} · 유사 매장 ${storeProfile.peer_count}개 · 추정 매출 ${formatWonCompact(storeProfile.actual_sales_amt)}`
    : "우리 매장 상권 특성과 주요 고객 유형을 확인합니다.";

  return (
    <div className="space-y-6">
      <PageHero title="상권·고객 분석" description={heroDescription} />

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

      <SalesTrendChart data={salesTrend} isLoading={salesTrendQuery.isLoading} />

      <MarketInsightBoardSection
        storeProfile={storeProfile}
        customerProfile={customerProfile}
        salesTrend={salesTrend}
        isLoading={isLoading}
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1.4fr]">
        <MarketStoreProfileSection data={storeProfile} isLoading={storeProfileQuery.isLoading} />
        <MarketCustomerSection data={customerProfile} isLoading={customerProfileQuery.isLoading} />
      </div>

      <MarketActionGuideSection
        storeProfile={storeProfile}
        customerProfile={customerProfile}
        isLoading={isLoading}
      />
    </div>
  );
}
