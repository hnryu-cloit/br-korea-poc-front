export interface ScheduleEvent {
  date: string;
  title: string;
  type: "campaign" | "telecom" | "notice";
  description: string;
}

export interface ScheduleNotice {
  id: string;
  title: string;
  description: string;
  tag: string;
  tone: "blue" | "green" | "orange" | "rose";
}

export interface ScheduleTodoItem {
  id: string;
  label: string;
  recurring: boolean;
}

export interface ScheduleResponse {
  updated_at: string;
  source: string;
  events: ScheduleEvent[];
  notices: ScheduleNotice[];
  todos: ScheduleTodoItem[];
}
