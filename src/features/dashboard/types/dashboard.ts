export type DashboardUrgency = "urgent" | "important" | "recommended";
export type DashboardActionType = "production" | "ordering" | "sales";
export type DashboardDomain = "production" | "ordering" | "sales";

export interface DashboardOverviewRequest {
  store_id: string;
  business_date?: string;
}

export interface DashboardNotificationLink {
  path: string;
  focus_section?: string;
  focus_id?: string;
  context?: Record<string, string | number | boolean>;
}

export interface DashboardNotificationItem {
  id: number;
  category: "alert" | "workflow" | "analysis";
  title: string;
  description: string;
  created_at: string;
  unread: boolean;
  link?: DashboardNotificationLink | null;
}

export interface DashboardPriorityAction {
  id: string;
  type: DashboardActionType;
  urgency: DashboardUrgency;
  badge_label: string;
  title: string;
  description: string;
  cta: {
    label: string;
    path: string;
  };
  focus_section?: string;
  related_sku_id?: string;
  ai_reasoning?: string;
  confidence_score?: number;
  is_finished_good: boolean;
  basis_data?: Record<string, string | number | boolean | null | undefined>;
}

export interface DashboardStatItem {
  key: "production_risk_count" | "ordering_deadline_minutes" | "today_profit_estimate" | "alert_count";
  label: string;
  value: number | string;
  unit?: "count" | "minutes";
  tone: "danger" | "primary" | "success" | "default";
}

export interface DashboardHighlightItem {
  title: string;
  description: string;
  tone?: "danger" | "warning" | "success" | "info" | "neutral";
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
  highlights_text: string[];
  highlights_data: Array<Record<string, string | number | boolean | null>>;
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
  priority_actions: DashboardPriorityAction[];
  stats: DashboardStatItem[];
  cards: DashboardSummaryCard[];
}
