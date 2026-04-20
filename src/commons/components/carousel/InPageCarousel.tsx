import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface CarouselBannerItem {
  id: string;
  title: string;
  description: string;
  tag?: string;
  tagColor?: "blue" | "green" | "orange" | "rose";
  onClick?: () => void;
}

const TAG_CLASS: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  orange: "bg-orange-100 text-orange-700",
  rose: "bg-rose-100 text-rose-700",
};

export function InPageCarousel({
  items,
  autoPlayMs = 3000,
}: {
  items: CarouselBannerItem[];
  autoPlayMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const go = useCallback(
    (next: number) => {
      if (items.length === 0) return;
      setIndex(((next % items.length) + items.length) % items.length);
    },
    [items.length],
  );

  useEffect(() => {
    if (items.length === 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    timerRef.current = setInterval(() => {
      setIndex((prev) => (((prev + 1) % items.length) + items.length) % items.length);
    }, autoPlayMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoPlayMs, items.length]);

  const handlePrev = () => {
    go(index - 1);
  };
  const handleNext = () => {
    go(index + 1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  if (items.length === 0) return null;

  const safeIndex = ((index % items.length) + items.length) % items.length;
  const current = items[safeIndex];

  return (
    <div
      className="relative overflow-hidden rounded-[20px] border border-border bg-white shadow-[0_8px_20px_rgba(16,32,51,0.06)]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="cursor-pointer px-5 py-4"
        onClick={current.onClick}
        role={current.onClick ? "button" : undefined}
        tabIndex={current.onClick ? 0 : undefined}
        onKeyDown={
          current.onClick
            ? (e) => {
                if (e.key === "Enter") current.onClick?.();
              }
            : undefined
        }
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            {current.tag && (
              <span
                className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${TAG_CLASS[current.tagColor ?? "blue"]}`}
              >
                {current.tag}
              </span>
            )}
            <p className="text-sm font-bold text-slate-900">{current.title}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{current.description}</p>
          </div>

          {/* 이전/다음 버튼 */}
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
              aria-label="이전"
            >
              <ChevronLeft className="h-3.5 w-3.5 text-slate-600" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
              aria-label="다음"
            >
              <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* 인디케이터 */}
      <div className="flex items-center justify-end gap-1.5 border-t border-border/30 px-5 py-2">
        <div className="flex gap-1">
          {items.map((_, i) => (
            <button
              key={items[i].id}
              type="button"
              onClick={() => {
                setIndex(i);
              }}
              aria-label={`${i + 1}번 배너`}
              className={`h-1.5 rounded-full transition-all ${i === safeIndex ? "w-4 bg-[#2454C8]" : "w-1.5 bg-slate-200"}`}
            />
          ))}
        </div>
        <span className="text-[10px] font-semibold text-slate-400">
          {safeIndex + 1} / {items.length}
        </span>
      </div>
    </div>
  );
}
