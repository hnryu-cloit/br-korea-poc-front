import {
  InPageCarousel,
  type CarouselBannerItem,
} from "@/commons/components/carousel/InPageCarousel";
import type { ScheduleNotice } from "../types/schedule";

interface Props {
  notices: ScheduleNotice[];
}

export const DashboardBanner = ({ notices }: Props) => {
  const noticeBanners: CarouselBannerItem[] = notices.map((notice) => ({
    id: notice.id,
    tag: notice.tag,
    title: notice.title,
    description: notice.description,
    tagColor: notice.tone,
  }));

  return (
    <div className="">
      {noticeBanners.length > 0 ? (
        <InPageCarousel items={noticeBanners} autoPlayMs={4000} />
      ) : (
        <p className="text-sm text-slate-400">노출 가능한 공지 데이터가 없습니다.</p>
      )}
    </div>
  );
};
