import { PRODUCTION_SUMMARY_ITEMS } from "@/features/dashboard/constants/summary-card";
import { SummaryCardListItem } from "@/features/dashboard/components/SummaryCardListItem";
import { SummaryCardSection } from "@/features/dashboard/components/SummaryCardSection";

export function ProductionSummaryCardBody() {
  return (
    <SummaryCardSection
      title="대표 메뉴 TOP 5 상황"
      action={<span className="text-xs text-[#314158]">현재 시간 : 16:54</span>}
    >
      <div className="flex flex-col gap-1">
        {PRODUCTION_SUMMARY_ITEMS.map((item) => (
          <SummaryCardListItem
            key={item.name}
            title={item.name}
            value={`${item.count}개`}
            description={`Ai 예측: 다음 1시간 동안 약 ${item.forecast}개 소진 예상`}
          />
        ))}
      </div>
    </SummaryCardSection>
  );
}
