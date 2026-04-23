import type { ScheduleNotice } from "@/features/dashboard/types/dashboard";

export type NoticeAccent = {
  label: string;
  badgeClassName: string;
  textClassName: string;
};

export type DashboardNoticeItem = ScheduleNotice & {
  title: string;
  accent: NoticeAccent | null;
};
