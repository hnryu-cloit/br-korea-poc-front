import { SALES_SUMMARY_ITEMS } from "@/features/dashboard/constants/summary-card";
import { SummaryCardListItem } from "@/features/dashboard/components/SummaryCardListItem";
import { SummaryCardSection } from "@/features/dashboard/components/SummaryCardSection";

export function SalesSummaryCardBody() {
  return (
    <SummaryCardSection title="매출 요약">
      <div className="flex flex-col gap-1">
        {SALES_SUMMARY_ITEMS.map((item) => (
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
