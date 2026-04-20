export type SchedulePanelTab = "todo" | "schedule";

export const SCHEDULE_PANEL_TAB_LABELS: Record<SchedulePanelTab, string> = {
  todo: "오늘 할일",
  schedule: "주요 일정",
};

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
