import { ChevronRight } from "lucide-react";

import type { ScheduleNotice } from "@/features/dashboard/types/dashboard";
import { resolveDashboardNotices } from "@/features/dashboard/utils/dashboard-notices";
interface Props {
  notices: ScheduleNotice[];
}

export function DashboardNotices({ notices }: Props) {
  const visibleNotices = resolveDashboardNotices(notices);
  const hasNotices = visibleNotices.length > 0;

  return (
    <section className="rounded-[8px] border border-[#DADADA] bg-white p-[16px] flex flex-col gap-[12px] max-h-[218px]">
      <h2 className="text-[18px] leading-[29.88px] font-bold text-brown-700">공지사항</h2>

      {hasNotices ? (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between items-center lg:gap-[89px]">
          <ul className="grid min-w-0 flex-1 gap-x-[134px] gap-y-[6px] lg:grid-cols-2">
            {visibleNotices.map((notice) => (
              <li key={notice.id} className="min-w-0">
                {notice.accent ? (
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={`inline-flex h-5 shrink-0 items-center rounded-xl px-[7px] text-sm leading-[19.88px] font-bold ${notice.accent.badgeClassName}`}
                    >
                      {notice.accent.label}
                    </span>
                    <p
                      className={`truncate text-base leading-6 font-normal ${notice.accent.textClassName} underline decoration-current underline-offset-2`}
                      title={notice.title}
                    >
                      {notice.title}
                    </p>
                  </div>
                ) : (
                  <p
                    className="truncate text-base leading-6 font-normal text-brown-600 underline decoration-current underline-offset-2"
                    title={notice.title}
                  >
                    {notice.title}
                  </p>
                )}
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="inline-flex shrink-0 items-center justify-center gap-1 px-3 py-1 text-sm font-bold text-pink-500"
          >
            <span>전체보기</span>
            <ChevronRight className="h-[18px] w-[18px]" />
          </button>
        </div>
      ) : (
        <div className="mt-3 flex min-h-[144px] items-center justify-center rounded-md border border-[#DADADA] bg-[#FFF7F6]">
          <p className="text-sm text-brown-500">노출 가능한 공지 데이터가 없습니다.</p>
        </div>
      )}
    </section>
  );
}
