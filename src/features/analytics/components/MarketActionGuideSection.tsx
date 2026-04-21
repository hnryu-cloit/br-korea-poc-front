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
  isLoading: boolean;
};

export function MarketActionGuideSection({
  storeProfile,
  customerProfile,
  aiActionPlan,
  source,
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
    <section className="rounded-[26px] border border-border bg-white px-6 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <p className="text-base font-bold text-slate-900">운영 액션 가이드</p>
          {source ? (
            <span className="rounded-md border border-slate-200 px-2 py-0.5 text-[11px] text-slate-500">
              AI 기반
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-slate-500">
          상권/고객 데이터 기준으로 바로 실행할 우선 액션입니다.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-12 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : (
        <ul className="space-y-2.5">
          {actionItems.map((item, index) => (
            <li
              key={`${item.slice(0, 20)}-${index}`}
              className="rounded-xl border border-[#d7e4ff] bg-[#f5f9ff] px-4 py-3 text-sm text-slate-700"
            >
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2454C8] text-[11px] font-bold text-white">
                {index + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
