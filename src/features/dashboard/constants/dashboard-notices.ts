import type { NoticeAccent } from "@/features/dashboard/types/dashboard-notices";

export const DASHBOARD_NOTICES_MAX_VISIBLE = 10;

export const DASHBOARD_NOTICE_ACCENT_BY_TAG: Partial<Record<string, NoticeAccent>> = {
  프로모션: {
    label: "프로모션",
    badgeClassName: "border border-blue-200 bg-blue-50 text-blue-700",
    textClassName: "text-brown-600",
  },
  제휴: {
    label: "제휴",
    badgeClassName: "border border-purple-200 bg-purple-50 text-purple-700",
    textClassName: "text-brown-600",
  },
  공지: {
    label: "공지",
    badgeClassName: "border border-slate-200 bg-slate-50 text-slate-600",
    textClassName: "text-brown-600",
  },
};
