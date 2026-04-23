import { SummaryCardListItem } from "@/features/dashboard/components/SummaryCardListItem";
import { SummaryCardSection } from "@/features/dashboard/components/SummaryCardSection";
import type { DashboardSalesSummaryCard } from "@/features/dashboard/types/dashboard";
import { buildSalesSummaryItems } from "@/features/dashboard/utils/summary-card";

export function SalesSummaryCardBody({ card }: { card: DashboardSalesSummaryCard }) {
  const items = buildSalesSummaryItems(card.sales_overview);

  return (
    <SummaryCardSection title="매출 요약">
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <SummaryCardListItem
            key={item.name}
            title={item.name}
            value={`${item.sales.toLocaleString("ko-KR")}원`}
            description={`${item.comparisonLabel}보다 ${(item.sales - item.previousSales).toLocaleString("ko-KR")}원 더 팔았어요`}
          />
        ))}
      </div>
    </SummaryCardSection>
  );
}
