import { PageHero } from "@/commons/components/page/page-layout";
import { MarketCustomerSection } from "@/features/analytics/components/MarketCustomerSection";
import { MarketStoreProfileSection } from "@/features/analytics/components/MarketStoreProfileSection";
import { useGetAnalyticsCustomerProfileQuery } from "@/features/analytics/queries/useGetAnalyticsCustomerProfileQuery";
import { useGetAnalyticsStoreProfileQuery } from "@/features/analytics/queries/useGetAnalyticsStoreProfileQuery";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";

export function MarketPage() {
  const { user } = useDemoSession();
  const storeProfileQuery = useGetAnalyticsStoreProfileQuery(user.storeId);
  const customerProfileQuery = useGetAnalyticsCustomerProfileQuery(user.storeId);

  return (
    <div className="space-y-6">
      <PageHero
        title="상권·고객 분석"
        description="우리 매장 상권 특성과 주요 고객 유형을 확인합니다."
      />
      <MarketStoreProfileSection
        data={storeProfileQuery.data}
        isLoading={storeProfileQuery.isLoading}
      />
      <MarketCustomerSection
        data={customerProfileQuery.data}
        isLoading={customerProfileQuery.isLoading}
      />
    </div>
  );
}