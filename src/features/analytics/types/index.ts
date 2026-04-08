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
