export type DashboardDomain = "production" | "ordering" | "sales";

export interface DashboardOverviewRequest {
  store_id: string;
  business_date?: string;
}
export interface DashboardStatItem {
  key:
    | "production_risk_count"
    | "ordering_deadline_minutes"
    | "today_profit_estimate"
    | "alert_count";
  label: string;
  value: number | string;
  unit?: "count" | "minutes";
  tone: "danger" | "primary" | "success" | "default";
}

export interface DashboardHighlightItem {
  type: string;
  tone?: "danger" | "warning" | "success" | "info" | "neutral";
  sku_id?: string;
  name?: string;
  status?: string;
  current?: number;
  forecast?: number;
  recommended?: number;
  depletion_time?: string | null;
  recommended_selected?: boolean;
  summary_status?: string;
  ordering_option_count?: number;
  recent_selection_count_7d?: number;
  selection_total?: number;
  production_danger_count?: number;
  ordering_selection_total?: number;
  status_label?: string;
}

export interface DashboardMetricItem {
  key: string;
  label: string;
  value: number | string;
  unit?: "count" | "minutes";
  tone?: "danger" | "primary" | "success" | "default";
}

export interface DashboardSummaryCard {
  domain: DashboardDomain;
  title: string;
  description: string;
  highlights: DashboardHighlightItem[];
  metrics: DashboardMetricItem[];
  cta: {
    label: string;
    path: string;
  };
  prompts: string[];
  status_label?: string;
  deadline_minutes?: number;
  delivery_scheduled?: boolean;
}

export interface DashboardOverviewResponse {
  updated_at: string;
  stats: DashboardStatItem[];
  cards: DashboardSummaryCard[];
  imminent_deadlines?: Array<Record<string, unknown>>;
}

export interface DashboardTodoItem {
  id: string;
  label: string;
  recurring: boolean;
  done: boolean;
}

export interface ScheduleEvent {
  date: string;
  title: string;
  category: "campaign" | "telecom" | "notice";
  type: string;
  startDate: string;
  endDate: string;
}

export interface ScheduleNotice {
  id: string;
  title: string;
  category: "campaign" | "telecom" | "notice";
  type: string;
  startDate: string;
  endDate: string;
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
