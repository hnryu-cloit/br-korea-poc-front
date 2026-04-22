import type { NoticeAccent } from "@/features/dashboard/types/dashboard-notices";

export const DASHBOARD_NOTICES_MAX_VISIBLE = 10;

export const DASHBOARD_NOTICE_ACCENT_BY_TONE: Partial<Record<string, NoticeAccent>> = {
  rose: {
    label: "긴급",
    badgeClassName: "bg-pink-500 text-white",
    textClassName: "text-pink-500",
  },
  orange: {
    label: "안내",
    badgeClassName: "bg-[#FFB38FB3] text-brown-600",
    textClassName: "text-brown-600",
  },
};
