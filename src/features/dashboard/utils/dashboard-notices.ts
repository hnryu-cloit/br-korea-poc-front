import {
  DASHBOARD_NOTICE_ACCENT_BY_TAG,
  DASHBOARD_NOTICES_MAX_VISIBLE,
} from "@/features/dashboard/constants/dashboard-notices";
import type { ScheduleNotice } from "@/features/dashboard/types/dashboard";
import type {
  DashboardNoticeItem,
  NoticeAccent,
} from "@/features/dashboard/types/dashboard-notices";

export function getNoticeAccent(tag: ScheduleNotice["tag"]): NoticeAccent | null {
  return DASHBOARD_NOTICE_ACCENT_BY_TAG[tag] ?? null;
}

export function resolveDashboardNotices(notices: ScheduleNotice[]): DashboardNoticeItem[] {
  return notices.slice(0, DASHBOARD_NOTICES_MAX_VISIBLE).map((notice) => ({
    ...notice,
    title: notice.name,
    accent: getNoticeAccent(notice.tag),
  }));
}
