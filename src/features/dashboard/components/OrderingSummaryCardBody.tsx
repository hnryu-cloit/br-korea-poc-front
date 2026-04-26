import aiPencilIcon from "@/assets/ai-pencil.svg";
import { SummaryCardListItem } from "@/features/dashboard/components/SummaryCardListItem";
import { SummaryCardSection } from "@/features/dashboard/components/SummaryCardSection";
import type { DashboardOrderingSummaryCard } from "@/features/dashboard/types/dashboard";
import {
  buildOrderingDeadlineDescription,
  buildOrderingSummarySuggestion,
} from "@/features/dashboard/utils/summary-card";
import { Link } from "react-router-dom";

export function OrderingSummaryCardBody({ card }: { card: DashboardOrderingSummaryCard }) {
  const suggestion = buildOrderingSummarySuggestion(card);

  return (
    <div className="flex flex-col gap-6">
      <SummaryCardSection title="AI 스마트 발주 추천">
        <div className="rounded-[8px] border border-[#FFB38F] bg-[#FFD9C71A] px-4 py-4">
          <div className="flex w-full items-center justify-between">
            <span className="bg-[linear-gradient(180deg,#FF6E00_0%,#DA1884_100%)] bg-clip-text text-[16px] leading-5 font-bold text-transparent">
              {suggestion.title}
            </span>
            <img src={aiPencilIcon} alt="" className="h-5 w-5 shrink-0" />
          </div>
          <p className="mt-3 text-sm leading-5 text-[#41352E]">
            <span className="font-bold">{suggestion.detailPrefix}</span>
            {suggestion.detailSuffix}
          </p>
        </div>
      </SummaryCardSection>
      <SummaryCardSection
        title="마감 임박 상품"
        action={
          <Link
            to="/ordering"
            className="flex h-[32px] items-center justify-center rounded-[4px] border border-pink-500 p-[2px_12px] text-sm font-bold text-pink-500"
          >
            상품 전체보기
          </Link>
        }
      >
        <div className="flex flex-col gap-1">
          {card.deadline_products.map((item, index) => (
            <SummaryCardListItem
              key={`${item.name}-${index}`}
              title={item.name}
              value={`${item.deadline_time} 마감`}
              description={buildOrderingDeadlineDescription(item)}
            />
          ))}
        </div>
      </SummaryCardSection>
    </div>
  );
}
