import type { NoticeAccent } from "@/features/dashboard/types/dashboard-notices";

export const DASHBOARD_NOTICES_MAX_VISIBLE = 10;

export const DASHBOARD_NOTICE_ACCENT_BY_TAG: Partial<Record<string, NoticeAccent>> = {
  긴급: {
    label: "긴급",
    badgeClassName: "bg-pink-500 text-white",
    textClassName: "text-pink-500",
  },
  안내: {
    label: "안내",
    badgeClassName: "bg-[#FFB38FB3] text-brown-600",
    textClassName: "text-brown-600",
  },
  공지: {
    label: "공지",
    badgeClassName: "bg-[#FFE8D6] text-[#8A4B22]",
    textClassName: "text-[#8A4B22]",
  },
};
