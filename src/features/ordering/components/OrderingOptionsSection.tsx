import { OrderingOptionCard } from "@/features/ordering/components/OrderingOptionCard";
import type { OrderingOption } from "@/features/ordering/types/ordering";

export function OrderingOptionsSection({
  options,
  selectedOptionId,
  onSelectOption,
  onConfirm,
  isSubmitting = false,
  errorMessage,
}: {
  options: OrderingOption[];
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  onConfirm: () => void | Promise<void>;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}) {
  return (
    <section className="flex flex-col items-center">
      <div className="flex flex-col items-center gap-5">
        <p className="text-[24px] text-black font-semibold">AI 추천 발주량</p>
        <p className="text-[20px] text-[#653819] font-medium">
          과거 동일 요일의 3가지 판매 패턴(전주, 전전주, 전월)을 분석하여 비교합니다.
        </p>
      </div>

      {options.length === 0 ? (
        <div className="mt-5 rounded-[24px] border border-dashed border-[#d6dfef] bg-[#f8fbff] px-6 py-10 text-center">
          <p className="text-base font-semibold text-slate-800">주문 추천안이 없습니다.</p>
          <p className="mt-2 text-sm text-slate-500">
            잠시 후 다시 조회하거나 주문 기준 조건을 확인해 주세요.
          </p>
        </div>
      ) : (
        <div className="mt-[24px] grid gap-[24px] xl:grid-cols-3">
          {options.map((option) => (
            <OrderingOptionCard
              key={option.option_id}
              option={option}
              selected={selectedOptionId === option.option_id}
              onSelect={() => onSelectOption(option.option_id)}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onConfirm}
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-[4px] h-8 w-[328px] bg-[linear-gradient(90deg,#FF6E00_0%,#DA1884_100%)] px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:bg-none mt-10"
      >
        {isSubmitting ? "발주 중..." : "선택하기"}
      </button>

      {errorMessage ? (
        <p className="mt-3 text-sm font-medium text-red-600">{errorMessage}</p>
      ) : null}
    </section>
  );
}
