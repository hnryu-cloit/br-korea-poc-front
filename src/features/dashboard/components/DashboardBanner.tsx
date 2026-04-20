import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CarouselBannerItem } from "@/commons/components/carousel/InPageCarousel";
import type { ScheduleNotice } from "../types/schedule";

interface Props {
  notices: ScheduleNotice[];
}

const TAG_CLASS: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  orange: "bg-orange-100 text-orange-700",
  rose: "bg-rose-100 text-rose-700",
};

export const DashboardBanner = ({ notices }: Props) => {
  const noticeBanners: CarouselBannerItem[] = notices.map((notice) => ({
    id: notice.id,
    tag: notice.tag,
    title: notice.title,
    description: notice.description,
    tagColor: notice.tone,
  }));

  const [trackIndex, setTrackIndex] = useState(1);
  const [animate, setAnimate] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const effectiveTrackIndex = noticeBanners.length <= 1 ? 0 : trackIndex;

  const loopItems = useMemo(() => {
    if (noticeBanners.length <= 1) return noticeBanners;
    const first = noticeBanners[0];
    const last = noticeBanners[noticeBanners.length - 1];
    return [last, ...noticeBanners, first];
  }, [noticeBanners]);

  const visibleIndex = useMemo(() => {
    if (noticeBanners.length <= 1) return 0;
    if (trackIndex === 0) return noticeBanners.length - 1;
    if (trackIndex === noticeBanners.length + 1) return 0;
    return trackIndex - 1;
  }, [noticeBanners.length, trackIndex]);

  const handlePrev = useCallback(() => {
    if (noticeBanners.length <= 1) return;
    setAnimate(true);
    setTrackIndex((prev) => prev - 1);
  }, [noticeBanners.length]);

  const handleNext = useCallback(() => {
    if (noticeBanners.length <= 1) return;
    setAnimate(true);
    setTrackIndex((prev) => prev + 1);
  }, [noticeBanners.length]);

  const handleGo = (index: number) => {
    if (noticeBanners.length <= 1) return;
    setAnimate(true);
    setTrackIndex(index + 1);
  };

  const handleTrackTransitionEnd = () => {
    if (noticeBanners.length <= 1) return;
    if (trackIndex === 0) {
      setAnimate(false);
      setTrackIndex(noticeBanners.length);
      return;
    }
    if (trackIndex === noticeBanners.length + 1) {
      setAnimate(false);
      setTrackIndex(1);
    }
  };

  useEffect(() => {
    if (!animate) {
      const raf = requestAnimationFrame(() => {
        setAnimate(true);
      });
      return () => cancelAnimationFrame(raf);
    }
    return;
  }, [animate]);

  useEffect(() => {
    if (noticeBanners.length <= 1) return;
    timerRef.current = setInterval(() => {
      handleNext();
    }, 4000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [handleNext, noticeBanners.length]);

  return (
    <div>
      {noticeBanners.length === 0 ? (
        <p className="text-sm text-slate-400">노출 가능한 공지 데이터가 없습니다.</p>
      ) : (
        <div className="relative overflow-hidden rounded-[20px] border border-border bg-white shadow-[0_8px_20px_rgba(16,32,51,0.06)]">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="이전 배너"
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-1.5 text-slate-600 shadow-sm transition-colors hover:bg-slate-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="다음 배너"
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-1.5 text-slate-600 shadow-sm transition-colors hover:bg-slate-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div
            className={`flex ${animate ? "transition-transform duration-500 ease-out" : ""}`}
            style={{ transform: `translateX(-${effectiveTrackIndex * 100}%)` }}
            onTransitionEnd={handleTrackTransitionEnd}
          >
            {loopItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="min-w-full cursor-pointer px-12 py-5"
                onClick={item.onClick}
                role={item.onClick ? "button" : undefined}
                tabIndex={item.onClick ? 0 : undefined}
                onKeyDown={
                  item.onClick
                    ? (e) => {
                        if (e.key === "Enter") item.onClick?.();
                      }
                    : undefined
                }
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    {item.tag ? (
                      <span
                        className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          TAG_CLASS[item.tagColor ?? "blue"]
                        }`}
                      >
                        {item.tag}
                      </span>
                    ) : null}
                    <p className="text-sm font-bold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-1.5 border-t border-border/30 px-5 py-2">
            {noticeBanners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => handleGo(index)}
                aria-label={`${index + 1}번 배너`}
                className={`h-1.5 rounded-full transition-all ${
                  index === visibleIndex ? "w-4 bg-[#2454C8]" : "w-1.5 bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
