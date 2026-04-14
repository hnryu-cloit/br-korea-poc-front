import { OrderingOptionCard } from "@/features/ordering/components/OrderingOptionCard";
import type { OrderingOption } from "@/features/ordering/constants/ordering";

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
          <p className="mt-1 text-sm text-slate-500">전일, 전주 동요일, 점주 반복 패턴 3축으로 고정해 비교합니다.</p>
        </div>
        <p className="text-sm font-medium text-slate-500">예측 및 권고는 최소 범위로 제공됩니다.</p>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        {options.map((option) => (
          <OrderingOptionCard
            key={option.id}
            option={option}
            selected={selectedOptionId === option.id}
            onSelect={() => onSelectOption(option.id)}
          />
        ))}
      </div>
    </section>
  );
}
