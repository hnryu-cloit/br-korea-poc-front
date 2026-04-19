import { useQuery } from "@tanstack/react-query";

import { PageHero } from "@/commons/components/page/page-layout";
import { getHQCoaching } from "@/features/admin/hq-coaching/api/hq-coaching";
import { HQCoachingOrdersTableSection } from "@/features/admin/hq-coaching/components/HQCoachingOrdersTableSection";
import { HQCoachingSummarySection } from "@/features/admin/hq-coaching/components/HQCoachingSummarySection";
import { HQCoachingTipsSection } from "@/features/admin/hq-coaching/components/HQCoachingTipsSection";

export function HQCoachingPage() {
  const coachingQuery = useQuery({
    queryKey: ["hq-coaching"],
    queryFn: getHQCoaching,
    refetchInterval: 30_000,
  });

  const storeOrders = coachingQuery.data?.store_orders ?? [];
  const coachingTips = coachingQuery.data?.coaching_tips ?? [];

  const normalCount = storeOrders.filter((s) => s.status === "normal").length;
  const reviewCount = storeOrders.filter((s) => s.status === "review").length;
  const riskCount = storeOrders.filter((s) => s.status === "risk").length;

  return (
    <div className="space-y-6">
      <PageHero
        title="담당 매장 주문 현황을 확인합니다."
        description="미완료 매장을 빠르게 파악하고 코칭 포인트를 제공합니다."
      />
      <HQCoachingSummarySection
        normalCount={normalCount}
        reviewCount={reviewCount}
        riskCount={riskCount}
      />
      <HQCoachingOrdersTableSection storeOrders={storeOrders} isLoading={coachingQuery.isLoading} />
      <HQCoachingTipsSection coachingTips={coachingTips} />
    </div>
  );
}
