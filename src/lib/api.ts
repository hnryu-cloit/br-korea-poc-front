const DEFAULT_API_BASE_URL = "http://localhost:8000";

function getApiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function appendOperationalFilters(
  params: URLSearchParams,
  filters?: { storeId?: string; dateFrom?: string; dateTo?: string },
) {
  if (!filters) {
    return;
  }
  if (filters.storeId) {
    params.set("store_id", filters.storeId);
  }
  if (filters.dateFrom) {
    params.set("date_from", filters.dateFrom);
  }
  if (filters.dateTo) {
    params.set("date_to", filters.dateTo);
  }
}

export type BootstrapResponse = {
  product: string;
  summary: string;
  users: string[];
  goals: string[];
  policies: string[];
  features: Record<string, Array<Record<string, string>>>;
};

export type OrderItem = {
  name: string;
  qty: number;
  note?: string | null;
};

export type OrderingOption = {
  id: string;
  label: string;
  basis: string;
  description: string;
  recommended: boolean;
  items: OrderItem[];
  notes: string[];
  reasoning?: string | null;
};

export type OrderingOptionsResponse = {
  deadline_minutes: number;
  notification_entry: boolean;
  focus_option_id?: string | null;
  options: OrderingOption[];
};

export type OrderSelectionRequest = {
  option_id: string;
  reason?: string;
  actor: string;
  store_id?: string;
};

export type OrderSelectionResponse = {
  option_id: string;
  reason?: string | null;
  actor: string;
  saved: boolean;
  store_id?: string | null;
};

export type OrderSelectionHistoryItem = {
  option_id: string;
  reason?: string | null;
  actor: string;
  saved: boolean;
  selected_at: string;
  store_id?: string | null;
};

export type OrderSelectionHistoryResponse = {
  items: OrderSelectionHistoryItem[];
  total: number;
  filtered_store_id?: string | null;
  filtered_date_from?: string | null;
  filtered_date_to?: string | null;
};

export type OrderSelectionSummaryResponse = {
  total: number;
  latest?: OrderSelectionHistoryItem | null;
  recommended_selected: boolean;
  recent_actor_roles: string[];
  recent_selection_count_7d: number;
  option_counts: Record<string, number>;
  summary_status: string;
  filtered_store_id?: string | null;
  filtered_date_from?: string | null;
  filtered_date_to?: string | null;
};

export type ProductionItem = {
  sku_id: string;
  name: string;
  current: number;
  forecast: number;
  status: "danger" | "warning" | "safe";
  depletion_time: string;
  recommended: number;
  prod1: string;
  prod2: string;
  alert_message?: string | null;
};

export type ProductionOverviewResponse = {
  updated_at: string;
  production_lead_time_minutes: number;
  danger_count: number;
  items: ProductionItem[];
};

export type ProductionRegistrationRequest = {
  sku_id: string;
  qty: number;
  registered_by: string;
  store_id?: string;
};

export type ProductionRegistrationResponse = {
  sku_id: string;
  qty: number;
  registered_by: string;
  feedback_type: string;
  feedback_message: string;
  store_id?: string | null;
};

export type ProductionRegistrationHistoryItem = {
  sku_id: string;
  qty: number;
  registered_by: string;
  feedback_type: string;
  feedback_message: string;
  registered_at: string;
  store_id?: string | null;
};

export type ProductionRegistrationHistoryResponse = {
  items: ProductionRegistrationHistoryItem[];
  total: number;
  filtered_store_id?: string | null;
  filtered_date_from?: string | null;
  filtered_date_to?: string | null;
};

export type ProductionRegistrationSummaryResponse = {
  total: number;
  latest?: ProductionRegistrationHistoryItem | null;
  total_registered_qty: number;
  recent_registered_by: string[];
  recent_registration_count_7d: number;
  recent_registered_qty_7d: number;
  affected_sku_count: number;
  summary_status: string;
  filtered_store_id?: string | null;
  filtered_date_from?: string | null;
  filtered_date_to?: string | null;
};

export type HomeOverviewRequest = {
  store_id?: string;
  business_date?: string;
};

export type HomePriorityAction = {
  id: string;
  type: "production" | "ordering" | "sales";
  urgency: "urgent" | "important" | "recommended";
  badge_label: string;
  title: string;
  description: string;
  cta_label: string;
  cta_path: string;
  focus_section?: string | null;
  related_sku_id?: string | null;
  ai_reasoning?: string | null;
  confidence_score?: number | null;
  is_finished_good: boolean;
};

export type HomeStatItem = {
  key: "production_risk_count" | "ordering_deadline_minutes" | "today_profit_estimate" | "alert_count";
  label: string;
  value: string;
  tone: "danger" | "primary" | "success" | "default";
};

export type HomeCardMetric = {
  label: string;
  value: string;
  tone: "danger" | "primary" | "success" | "default";
};

export type HomeSummaryCard = {
  domain: "production" | "ordering" | "sales";
  title: string;
  description: string;
  highlights: string[];
  metrics: HomeCardMetric[];
  cta_label: string;
  cta_path: string;
  prompts: string[];
  status_label?: string | null;
  deadline_minutes?: number | null;
  delivery_scheduled?: boolean | null;
};

export type HomeOverviewResponse = {
  updated_at: string;
  priority_actions: HomePriorityAction[];
  stats: HomeStatItem[];
  cards: HomeSummaryCard[];
};

export async function fetchBootstrap() {
  return request<BootstrapResponse>("/api/bootstrap");
}

export async function fetchOrderingOptions(notificationEntry: boolean) {
  const query = new URLSearchParams({
    notification_entry: String(notificationEntry),
  });
  return request<OrderingOptionsResponse>(`/api/ordering/options?${query.toString()}`);
}

export async function saveOrderSelection(payload: OrderSelectionRequest) {
  return request<OrderSelectionResponse>("/api/ordering/selections", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchOrderSelectionHistory(
  limit = 20,
  filters?: { storeId?: string; dateFrom?: string; dateTo?: string },
) {
  const query = new URLSearchParams({
    limit: String(limit),
  });
  appendOperationalFilters(query, filters);
  return request<OrderSelectionHistoryResponse>(`/api/ordering/selections/history?${query.toString()}`);
}

export async function fetchOrderSelectionSummary(filters?: { storeId?: string; dateFrom?: string; dateTo?: string }) {
  const query = new URLSearchParams();
  appendOperationalFilters(query, filters);
  return request<OrderSelectionSummaryResponse>(`/api/ordering/selections/summary?${query.toString()}`);
}

export async function fetchProductionOverview() {
  return request<ProductionOverviewResponse>("/api/production/overview");
}

export async function saveProductionRegistration(payload: ProductionRegistrationRequest) {
  return request<ProductionRegistrationResponse>("/api/production/registrations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchProductionRegistrationHistory(
  limit = 20,
  filters?: { storeId?: string; dateFrom?: string; dateTo?: string },
) {
  const query = new URLSearchParams({
    limit: String(limit),
  });
  appendOperationalFilters(query, filters);
  return request<ProductionRegistrationHistoryResponse>(`/api/production/registrations/history?${query.toString()}`);
}

export async function fetchProductionRegistrationSummary(filters?: { storeId?: string; dateFrom?: string; dateTo?: string }) {
  const query = new URLSearchParams();
  appendOperationalFilters(query, filters);
  return request<ProductionRegistrationSummaryResponse>(`/api/production/registrations/summary?${query.toString()}`);
}

export type ProductionSimulationRequest = {
  store_id: string;
  item_id: string;
  simulation_date: string; // YYYY-MM-DD
  lead_time_hour?: number;
  margin_rate?: number;
};

export type SimulationChartPoint = {
  time: string;
  actual_stock: number;
  ai_guided_stock: number;
};

export type SimulationSummaryMetrics = {
  additional_sales_qty: number;
  additional_profit_amt: number;
  additional_waste_qty: number;
  additional_waste_cost: number;
  net_profit_change: number;
  performance_status: string;
  chance_loss_reduction?: number | null;
};

export type ProductionSimulationResponse = {
  metadata: Record<string, unknown>;
  summary_metrics: SimulationSummaryMetrics;
  time_series_data?: SimulationChartPoint[];
  chart_data?: SimulationChartPoint[];
  actions_timeline?: string[];
  action_timeline?: string[];
};

export function getProductionSimulationChartData(response?: ProductionSimulationResponse | null) {
  return response?.time_series_data ?? response?.chart_data ?? [];
}

export function getProductionSimulationTimeline(response?: ProductionSimulationResponse | null) {
  return response?.actions_timeline ?? response?.action_timeline ?? [];
}

export async function runProductionSimulation(payload: ProductionSimulationRequest) {
  return request<ProductionSimulationResponse>("/api/production/simulation", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchHomeOverview(payload: HomeOverviewRequest = {}) {
  return request<HomeOverviewResponse>("/api/home/overview", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ── Sales ──────────────────────────────────────────────────────────────────

export type SalesPrompt = {
  label: string;
  category: string;
  prompt: string;
};

export type SalesComparisonMetric = {
  label: string;
  store_value: string;
  peer_value: string;
};

export type SalesComparison = {
  store: string;
  peer_group: string;
  summary: string;
  metrics: SalesComparisonMetric[];
};

export type SalesQueryResponse = {
  text: string;
  evidence: string[];
  actions: string[];
  comparison?: SalesComparison | null;
  query_type?: string | null;
  processing_route?: string | null;
  blocked: boolean;
  masked_fields: string[];
  // AI 고도화 필드 추가
  confidence_score?: number;
  semantic_logic?: string;
  sources?: string[];
  visual_data?: Record<string, unknown> | unknown[];
};

export type SalesInsightMetric = {
  label: string;
  value: string;
  detail?: string | null;
};

export type SalesInsightSection = {
  title: string;
  summary: string;
  metrics: SalesInsightMetric[];
  actions: string[];
  status: string;
};

export type SalesInsightsResponse = {
  peak_hours: SalesInsightSection;
  channel_mix: SalesInsightSection;
  payment_mix: SalesInsightSection;
  menu_mix: SalesInsightSection;
  campaign_seasonality?: SalesInsightSection | null;
  filtered_store_id?: string | null;
  filtered_date_from?: string | null;
  filtered_date_to?: string | null;
};

export async function fetchSalesPrompts() {
  return request<SalesPrompt[]>("/api/sales/prompts");
}

export async function querySales(prompt: string) {
  return request<SalesQueryResponse>("/api/sales/query", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });
}

export async function fetchSalesInsights(filters?: { storeId?: string; dateFrom?: string; dateTo?: string }) {
  const query = new URLSearchParams();
  appendOperationalFilters(query, filters);
  return request<SalesInsightsResponse>(`/api/sales/insights?${query.toString()}`);
}

// ── Audit ──────────────────────────────────────────────────────────────────

export type AuditLogEntry = {
  id: number;
  timestamp: string;
  domain: string;
  event_type: string;
  actor_role: string;
  route: string;
  outcome: string;
  message: string;
  metadata: Record<string, unknown>;
};

export type AuditLogListResponse = {
  items: AuditLogEntry[];
  total: number;
  filtered_domain?: string | null;
};

export async function fetchAuditLogs(domain?: string, limit = 50) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (domain) params.set("domain", domain);
  return request<AuditLogListResponse>(`/api/audit/logs?${params.toString()}`);
}

// ── Notifications ──────────────────────────────────────────────────────────

export type ApiNotification = {
  id: number;
  category: "alert" | "workflow" | "analysis";
  title: string;
  description: string;
  created_at: string;
  unread: boolean;
  link_to?: string | null;
  link_state?: Record<string, unknown> | null;
};

export type NotificationListResponse = {
  items: ApiNotification[];
  unread_count: number;
};

export async function fetchNotifications() {
  return request<NotificationListResponse>("/api/notifications");
}

// ── Analytics ──────────────────────────────────────────────────────────────

export type AnalyticsMetric = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "flat";
  detail: string;
};

export type AnalyticsMetricsResponse = {
  items: AnalyticsMetric[];
};

export async function fetchAnalyticsMetrics() {
  return request<AnalyticsMetricsResponse>("/api/analytics/metrics");
}

// ── HQ ─────────────────────────────────────────────────────────────────────

export type StoreOrderItem = {
  store: string;
  region: string;
  option: string;
  basis: string;
  reason: string;
  submitted_at: string;
  status: "normal" | "review" | "risk";
};

export type CoachingTip = {
  store: string;
  tip: string;
};

export type HQCoachingResponse = {
  store_orders: StoreOrderItem[];
  coaching_tips: CoachingTip[];
};

export type StoreInspectionItem = {
  store: string;
  region: string;
  alert_response_rate: number;
  production_registered: number;
  production_total: number;
  chance_loss_change: string;
  status: "compliant" | "partial" | "noncompliant";
};

export type HQInspectionResponse = {
  items: StoreInspectionItem[];
};

export async function fetchHQCoaching() {
  return request<HQCoachingResponse>("/api/hq/coaching");
}

export async function fetchHQInspection() {
  return request<HQInspectionResponse>("/api/hq/inspection");
}

// ── Signals ────────────────────────────────────────────────────────────────

export type SalesSignal = {
  id: string;
  title: string;
  metric: string;
  value: string;
  change: string;
  trend: "up" | "down" | "flat";
  priority: "high" | "medium" | "low";
  region: string;
  insight: string;
};

export type SignalsResponse = {
  items: SalesSignal[];
  high_count: number;
};

export async function fetchSignals() {
  return request<SignalsResponse>("/api/signals");
}

// ── 주문 마감 알림 ────────────────────────────────────────────────────────

export type OrderingDeadlineInfo = {
  store_id: string;
  deadline: string;
  minutes_remaining: number;
  is_urgent: boolean;
  is_passed: boolean;
};

export async function fetchOrderingDeadline(storeId: string): Promise<OrderingDeadlineInfo> {
  return request<OrderingDeadlineInfo>(`/api/ordering/deadline?store_id=${encodeURIComponent(storeId)}`);
}

// ── 생산 PUSH 알림 ───────────────────────────────────────────────────────

export type ProductionPushAlert = {
  title: string;
  body: string;
  sku_id: string;
  store_id: string;
  severity: "high" | "medium" | "low";
};

export type ProductionPushAlertList = {
  store_id: string;
  alerts: ProductionPushAlert[];
  alert_count: number;
};

export async function fetchProductionPushAlerts(storeId: string): Promise<ProductionPushAlertList> {
  return request<ProductionPushAlertList>(`/api/production/alerts/push?store_id=${encodeURIComponent(storeId)}`);
}

// ── 수익성 시뮬레이션 ────────────────────────────────────────────────────

export type ProfitabilitySimulationRequest = {
  store_id: string;
  item_id?: string | null;
  date_from: string;
  date_to: string;
};

export type ProfitabilitySimulationResponse = {
  store_id: string;
  date_from: string;
  date_to: string;
  total_revenue: number;
  estimated_margin_rate: number;
  estimated_profit: number;
  top_items: Array<Record<string, unknown>>;
  simulation_note: string;
};

export async function fetchProfitabilitySimulation(
  payload: ProfitabilitySimulationRequest,
): Promise<ProfitabilitySimulationResponse> {
  return request<ProfitabilitySimulationResponse>("/api/sales/profitability", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
