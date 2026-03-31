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
};

export type OrderSelectionResponse = {
  option_id: string;
  reason?: string | null;
  actor: string;
  saved: boolean;
};

export type OrderSelectionHistoryItem = {
  option_id: string;
  reason?: string | null;
  actor: string;
  saved: boolean;
  selected_at: string;
};

export type OrderSelectionHistoryResponse = {
  items: OrderSelectionHistoryItem[];
  total: number;
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
};

export type ProductionRegistrationResponse = {
  sku_id: string;
  qty: number;
  registered_by: string;
  feedback_type: string;
  feedback_message: string;
};

export type ProductionRegistrationHistoryItem = {
  sku_id: string;
  qty: number;
  registered_by: string;
  feedback_type: string;
  feedback_message: string;
  registered_at: string;
};

export type ProductionRegistrationHistoryResponse = {
  items: ProductionRegistrationHistoryItem[];
  total: number;
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

export async function fetchOrderSelectionHistory(limit = 20) {
  const query = new URLSearchParams({
    limit: String(limit),
  });
  return request<OrderSelectionHistoryResponse>(`/api/ordering/selections/history?${query.toString()}`);
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

export async function fetchProductionRegistrationHistory(limit = 20) {
  const query = new URLSearchParams({
    limit: String(limit),
  });
  return request<ProductionRegistrationHistoryResponse>(`/api/production/registrations/history?${query.toString()}`);
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
