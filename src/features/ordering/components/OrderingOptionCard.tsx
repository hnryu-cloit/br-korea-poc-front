import { List, X } from "lucide-react";
import type { KeyboardEvent, MouseEvent } from "react";
import { useState } from "react";

import { AppModal } from "@/commons/components/modal/AppModal";
import { formatCountWithUnit } from "@/commons/utils/format-count";
import type { OrderingOption } from "@/features/ordering/types/ordering";

export function OrderingOptionCard({
  option,
  selected,
  onSelect,
}: {
  option: OrderingOption;
  selected: boolean;
  onSelect: () => void;
}) {
  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false);
  const maxVisibleItems = 10;
  const orderedItems = option.items.filter((item) => item.quantity > 0);
  const visibleItems = orderedItems.slice(0, maxVisibleItems);
  const remainingItems = orderedItems.slice(maxVisibleItems);
  const hiddenItemCount = Math.max(orderedItems.length - maxVisibleItems, 0);

  const handleOpenItemsModal = (
    event: MouseEvent<HTMLSpanElement> | KeyboardEvent<HTMLSpanElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setIsItemsModalOpen(true);
  };

  return (
    <article
      className={`relative rounded-[28px] border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)] transition-all ${
        selected
          ? "border-[#2454C8] ring-1 ring-[#2454C8]/20"
          : "border-border hover:border-[#bfd1ed]"
      }`}
    >
      <button type="button" className="w-full text-left" onClick={onSelect}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-slate-900">{option.title}</p>
            <p className="mt-1 text-xs font-semibold text-slate-400">{option.basis}</p>
          </div>
          {option.recommended ? (
            <span className="rounded-full bg-[#2454C8] px-3 py-1 text-xs font-bold text-white">
              AI 추천
            </span>
          ) : null}
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-500">{option.description}</p>

        <div className="mt-4 space-y-2">
          {visibleItems.map((item) => (
            <div
              key={`${option.option_id}-${item.sku_name}`}
              className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-3 py-2.5 text-sm"
            >
              <span className="text-slate-600">{item.sku_name}</span>
              <span className="font-bold text-slate-800">
                {formatCountWithUnit(item.quantity, "개")}
              </span>
            </div>
          ))}
        </div>
        {hiddenItemCount > 0 ? (
          <div className="mt-2">
            <span
              role="button"
              tabIndex={0}
              onClick={handleOpenItemsModal}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  handleOpenItemsModal(event);
                }
              }}
              className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-[#2454C8] hover:text-[#1f46a8]"
            >
              <List className="h-3.5 w-3.5" />
              {`나머지 ${hiddenItemCount}개 주문 추천 상품 확인하기`}
            </span>
          </div>
        ) : null}

        <div className="mt-4 rounded-2xl bg-[#edf4ff] px-4 py-4">
          <p className="text-xs font-bold text-[#2454C8]">추천 근거</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{option.reasoning_text}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {option.reasoning_metrics.map((metric) => (
              <div key={metric.key} className="rounded-2xl bg-white px-3 py-3">
                <p className="text-[11px] font-semibold text-slate-400">{metric.key}</p>
                <p className="mt-1 text-sm font-bold text-slate-900">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>

        {option.special_factors.length ? (
          <div className="mt-4">
            <p className="text-xs font-bold text-slate-500">예외 변수 반영</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {option.special_factors.map((factor) => (
                <span
                  key={factor}
                  className="rounded-full border border-[#dce4f3] bg-[#f7faff] px-3 py-1 text-[11px] font-semibold text-slate-600"
                >
                  {factor}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </button>
      {isItemsModalOpen ? (
        <AppModal onClose={() => setIsItemsModalOpen(false)}>
          <section className="mx-auto w-full max-w-2xl rounded-[24px] border border-border bg-white shadow-[0_20px_48px_rgba(16,32,51,0.22)]">
            <header className="flex items-center justify-between border-b border-border/60 px-6 py-4">
              <div>
                <p className="text-base font-bold text-slate-900">주문 추천 상품 전체</p>
                <p className="mt-1 text-xs text-slate-500">추가 상품 {hiddenItemCount}개</p>
              </div>
              <button
                type="button"
                onClick={() => setIsItemsModalOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                aria-label="팝업 닫기"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
              <div className="space-y-2">
                {remainingItems.map((item) => (
                  <div
                    key={`${option.option_id}-modal-${item.sku_name}`}
                    className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-3 py-2.5 text-sm"
                  >
                    <span className="text-slate-600">{item.sku_name}</span>
                    <span className="font-bold text-slate-800">
                      {formatCountWithUnit(item.quantity, "개")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </AppModal>
      ) : null}
    </article>
  );
}
