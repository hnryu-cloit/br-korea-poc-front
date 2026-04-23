import { ExternalLinkIcon, X } from "lucide-react";
import type { KeyboardEvent, MouseEvent } from "react";
import { useState } from "react";

import aiPencilIcon from "@/assets/ai-pencil.svg";
import { AppModal } from "@/commons/components/modal/AppModal";
import { formatCountWithUnit } from "@/commons/utils/format-count";
import type { OrderingOption } from "@/features/ordering/types/ordering";
import dayjs from "dayjs";

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
  const maxVisibleItems = 6;
  const orderedItems = option.items.filter((item) => item.quantity > 0);
  const visibleItems = orderedItems.slice(0, maxVisibleItems);
  const hiddenItemCount = Math.max(orderedItems.length - maxVisibleItems, 0);

  const handleOpenItemsModal = (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsItemsModalOpen(true);
  };

  const cardContent = (
    <article
      className={`relative rounded-[8px] p-6 w-[360px] ${
        selected
          ? "border border-t-4 border-transparent [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(90deg,#FF6E00_0%,#DA1884_100%)_border-box]"
          : "border-[#DADADA] bg-white"
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        className="w-full text-left"
        onClick={onSelect}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect();
          }
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold text-brown-700">{option.title}</p>
            <p className="text-md text-brown-700">
              ({dayjs(option.basis).format("MM월 DD일 • ddd요일")})
            </p>
          </div>
        </div>

        <div className="relative mt-4">
          <div className="flex flex-col gap-2">
            {visibleItems.map((item) => (
              <div
                key={`${option.option_id}-${item.sku_name}`}
                className="flex items-center justify-between rounded-[8px] bg-[#DADADA]/40 px-3 py-2 text-sm"
              >
                <span className="text-[#653819]">{item.sku_name}</span>
                <span className="font-bold text-orange-500">
                  {formatCountWithUnit(item.quantity, "개")}
                </span>
              </div>
            ))}
          </div>

          {hiddenItemCount > 0 ? (
            <>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 rounded-b-[8px] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.18)_40%,rgba(255,255,255,0.42)_72%,rgba(255,255,255,0.58)_100%)] backdrop-blur-[2.4px] [mask-image:linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.45)_42%,#000_100%)] [-webkit-mask-image:linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.45)_42%,#000_100%)]" />
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleOpenItemsModal(event);
                }}
                className="absolute bottom-0 left-1/2 z-10 flex h-8 -translate-x-1/2 items-center gap-[6px] rounded-[4px] border border-pink-500 bg-white/92 px-3 text-sm font-bold text-pink-500 shadow-[0_2px_10px_rgba(255,255,255,0.45)] backdrop-blur-[1.2px]"
              >
                상품 전체 보기
                <ExternalLinkIcon className="h-[18px] text-pink-700" />
              </button>
            </>
          ) : null}
        </div>

        <div className="mt-10 rounded-[8px] border border-[#FFB38F] bg-[#FFD9C7]/10 px-4 py-3 flex flex-col gap-2">
          <div className="flex w-full items-center justify-between">
            <span className="bg-[linear-gradient(180deg,#FF6E00_0%,#DA1884_100%)] bg-clip-text text-[14px] leading-5 font-bold text-transparent">
              Ai 추천 근거
            </span>
            <img src={aiPencilIcon} alt="" className="h-5 w-5 shrink-0" />
          </div>
          <p className=" text-sm leading-5 text-[#41352E] px-2">{option.reasoning_text}</p>
        </div>
      </div>
      {isItemsModalOpen ? (
        <AppModal onClose={() => setIsItemsModalOpen(false)}>
          <section className="mx-auto w-full max-w-2xl rounded-[24px] border border-border bg-white shadow-[0_20px_48px_rgba(16,32,51,0.22)]">
            <header className="flex items-center justify-between border-b border-border/60 px-6 py-4">
              <div>
                <p className="text-md font-bold text-brown-700">주문 추천 상품 전체</p>
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
                {orderedItems.map((item) => (
                  <div
                    key={`${option.option_id}-modal-${item.sku_name}`}
                    className="flex items-center justify-between rounded-[8px] bg-[#DADADA]/40 px-3 py-2 text-sm"
                  >
                    <span className="text-[#653819]">{item.sku_name}</span>
                    <span className="font-bold text-orange-500">
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

  return cardContent;
}
