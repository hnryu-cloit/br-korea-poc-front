import { SummaryCardListItem } from "@/features/dashboard/components/SummaryCardListItem";
import { SummaryCardSection } from "@/features/dashboard/components/SummaryCardSection";
import type { DashboardProductionSummaryItem } from "@/features/dashboard/types/dashboard";
import dayjs from "dayjs";

export function ProductionSummaryCardBody({
  items,
  updatedAt,
}: {
  items: DashboardProductionSummaryItem[];
  updatedAt?: string;
}) {
  return (
    <SummaryCardSection
      title="대표 메뉴 TOP 5 상황"
      action={
        <span className="text-xs text-[#314158]">
          업데이트 시간 : {updatedAt ? dayjs(updatedAt).format("HH:mm") : "-"}
        </span>
      }
    >
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <SummaryCardListItem
            key={item.name}
            title={item.name}
            value={`${item.current_stock}개`}
            description={`Ai 예측: 다음 1시간 동안 약 ${item.predicted_consumption_1h}개 소진 예상`}
          />
        ))}
      </div>
    </SummaryCardSection>
  );
}
