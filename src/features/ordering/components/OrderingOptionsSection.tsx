import { CardAiButton } from "@/commons/components/chat/CardAiButton";
import { OrderingOptionCard } from "@/features/ordering/components/OrderingOptionCard";
import type { OrderingOption } from "@/features/ordering/types/ordering";

export function OrderingOptionsSection({
  options,
  selectedOptionId,
  onSelectOption,
}: {
  options: OrderingOption[];
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
}) {
  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-slate-900">주문 추천안 비교</p>
          <p className="mt-1 text-sm text-slate-500">전주, 전전주, 전월 동요일 패턴 3축으로 고정해 비교합니다.</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium text-slate-500">예측 및 권고는 최소 범위로 제공됩니다.</p>
          <CardAiButton contextKey="ordering:options" />
        </div>
      </div>

      {options.length === 0 ? (
        <div className="mt-5 rounded-[24px] border border-dashed border-[#d6dfef] bg-[#f8fbff] px-6 py-10 text-center">
          <p className="text-base font-semibold text-slate-800">주문 추천안이 없습니다.</p>
          <p className="mt-2 text-sm text-slate-500">잠시 후 다시 조회하거나 주문 기준 조건을 확인해 주세요.</p>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 xl:grid-cols-3">
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
    </section>
  );
}
