export type SchedulePanelTab = "todo" | "schedule";

export const SCHEDULE_PANEL_TAB_LABELS: Record<SchedulePanelTab, string> = {
  todo: "오늘 할일",
  schedule: "주요 일정",
};

export const SCHEDULE_MAX_VISIBLE_TODOS = 4;
export const SCHEDULE_MAX_VISIBLE_EVENTS = 3;
export const SCHEDULE_ENDING_SOON_THRESHOLD_DAYS = 3;

export const SCHEDULE_EVENT_TYPE_STYLE: Record<string, string> = {
  campaign: "bg-blue-50 text-blue-700 border-blue-200",
  telecom: "bg-purple-50 text-purple-700 border-purple-200",
  notice: "bg-slate-50 text-slate-600 border-slate-200",
};

export const SCHEDULE_EVENT_TYPE_LABEL: Record<string, string> = {
  campaign: "캠페인",
  telecom: "통신사 할인",
  notice: "공지",
};

export type ScheduleEventStatus = "ending_soon" | "in_progress" | "upcoming";

export const SCHEDULE_EVENT_STATUS_LABEL: Record<ScheduleEventStatus, string> = {
  ending_soon: "종료임박",
  in_progress: "진행중",
  upcoming: "시작예정",
};

export const SCHEDULE_EVENT_STATUS_STYLE: Record<ScheduleEventStatus, string> = {
  ending_soon: "bg-amber-50 text-amber-700 border-amber-200",
  in_progress: "bg-emerald-50 text-emerald-700 border-emerald-200",
  upcoming: "bg-sky-50 text-sky-700 border-sky-200",
};

export const SCHEDULE_EVENT_STATUS_PRIORITY: Record<ScheduleEventStatus, number> = {
  ending_soon: 0,
  in_progress: 1,
  upcoming: 2,
};
