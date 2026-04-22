import {
  DASHBOARD_NOTICE_ACCENT_BY_TONE,
  DASHBOARD_NOTICES_MAX_VISIBLE,
} from "@/features/dashboard/constants/dashboard-notices";
import type { ScheduleNotice } from "@/features/dashboard/types/dashboard";
import type {
  DashboardNoticeItem,
  NoticeAccent,
} from "@/features/dashboard/types/dashboard-notices";

export function getNoticeAccent(tone: ScheduleNotice["tone"]): NoticeAccent | null {
  return DASHBOARD_NOTICE_ACCENT_BY_TONE[tone] ?? null;
}

export function resolveDashboardNotices(notices: ScheduleNotice[]): DashboardNoticeItem[] {
  return notices.slice(0, DASHBOARD_NOTICES_MAX_VISIBLE).map((notice) => ({
    ...notice,
    accent: getNoticeAccent(notice.tone),
  }));
}
