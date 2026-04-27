import dayjs from "dayjs";

import { SummaryCardListItem } from "@/features/dashboard/components/SummaryCardListItem";
import { SummaryCardSection } from "@/features/dashboard/components/SummaryCardSection";
import type { DashboardProductionSummaryItem } from "@/features/dashboard/types/dashboard";

export function ProductionSummaryCardBody({
  items,
  updatedAt,
}: {
  items: DashboardProductionSummaryItem[];
  updatedAt?: string;
}) {
  return (
    <SummaryCardSection
      title="위험 메뉴 TOP 5 현황"
      captionKey="dashboard:production_risk_top5"
      action={
        <span className="text-xs text-[#314158]">
          업데이트 시간 : {updatedAt ? dayjs(updatedAt).format("HH:mm") : "-"}
        </span>
      }
    >
      <div className="flex flex-col gap-1">
        {items.map((item, index) => (
          <SummaryCardListItem
            key={`${item.name}-${index}`}
            title={item.name}
            value={`${item.current_stock}개`}
            description={`AI 예측: 다음 1시간 동안 약 ${item.predicted_consumption_1h}개 소진 예상`}
          />
        ))}
      </div>
    </SummaryCardSection>
  );
}
