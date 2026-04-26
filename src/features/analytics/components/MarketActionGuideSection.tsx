import ai_pencil from "@/assets/ai-pencil.svg";
import type {
  MarketActionItem,
  CustomerProfileResponse,
  StoreProfileResponse,
} from "@/features/analytics/types/analytics";
import { buildMarketActionItems } from "@/features/analytics/utils/market";

type Props = {
  storeProfile?: StoreProfileResponse;
  customerProfile?: CustomerProfileResponse;
  aiActionPlan?: MarketActionItem[];
  source?: "ai";
  isError?: boolean;
  isLoading: boolean;
};

export function MarketActionGuideSection({
  storeProfile,
  customerProfile,
  aiActionPlan,
  source,
  isError,
  isLoading,
}: Props) {
  const actionItems =
    aiActionPlan && aiActionPlan.length > 0
      ? aiActionPlan
          .sort((a, b) => a.priority - b.priority)
          .slice(0, 3)
          .map((item) => `${item.title}: ${item.action}`)
      : buildMarketActionItems({ storeProfile, customerProfile });

  return (
    <section className="rounded-[28px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <p className="text-md font-bold text-brown-700">운영 액션 가이드</p>
          {source ? (
            <span className="rounded-full bg-[#eef4ff] px-2.5 py-1 text-[10px] font-bold text-[#2454C8]">
              AI 기반
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-[#653819]">
          상권/고객 데이터 기준으로 바로 실행할 우선 액션입니다.
        </p>
        {isError ? (
          <p className="mt-2 text-xs font-medium text-red-600">
            일부 데이터를 불러오지 못해 기본 가이드를 함께 보여줍니다.
          </p>
        ) : null}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-12 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {actionItems.map((item, index) => (
            <li
              key={`${item.slice(0, 20)}-${index}`}
              className="flex items-start gap-2 rounded-xl border border-[#FFB38F] bg-[#FFD9C71A] px-3 py-2 text-sm font-medium text-[#41352E]"
            >
              <img src={ai_pencil} className="mt-0.5 h-4 w-4 shrink-0" alt="" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
