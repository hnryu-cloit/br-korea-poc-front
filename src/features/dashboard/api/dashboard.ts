import axiosInstance from "@/services/axiosInstance";

import type {
  DashboardActionType,
  DashboardDomain,
  DashboardOverviewRequest,
  DashboardOverviewResponse,
  DashboardMetricItem,
  DashboardPriorityAction,
  DashboardStatItem,
  DashboardSummaryCard,
  DashboardUrgency,
} from "@/features/dashboard/types/dashboard";

type UnknownRecord = Record<string, unknown>;

const asRecord = (value: unknown): UnknownRecord =>
  typeof value === "object" && value !== null ? (value as UnknownRecord) : {};

const asString = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const asNumberOrString = (value: unknown): number | string =>
  typeof value === "number" || typeof value === "string" ? value : "";

const isDashboardUnit = (
  value: unknown,
): value is DashboardStatItem["unit"] =>
  value === "count" || value === "minutes";

const isDashboardTone = (
  value: unknown,
): value is DashboardStatItem["tone"] =>
  value === "danger" || value === "primary" || value === "success" || value === "default";

const isDashboardStatKey = (
  value: unknown,
): value is DashboardStatItem["key"] =>
  value === "production_risk_count"
  || value === "ordering_deadline_minutes"
  || value === "today_profit_estimate"
  || value === "alert_count";

const isDashboardUrgency = (value: unknown): value is DashboardUrgency =>
  value === "urgent" || value === "important" || value === "recommended";

const isDashboardActionType = (value: unknown): value is DashboardActionType =>
  value === "production" || value === "ordering" || value === "sales";

const isDashboardDomain = (value: unknown): value is DashboardDomain =>
  value === "production" || value === "ordering" || value === "sales";

const normalizeStat = (statRaw: unknown): DashboardStatItem => {
  const stat = asRecord(statRaw);
  return {
    key: isDashboardStatKey(stat.key) ? stat.key : "alert_count",
    label: asString(stat.label),
    value: asNumberOrString(stat.value),
    unit: isDashboardUnit(stat.unit) ? stat.unit : undefined,
    tone: isDashboardTone(stat.tone) ? stat.tone : "default",
  };
};

const normalizeMetric = (metricRaw: unknown): DashboardMetricItem => {
  const metric = asRecord(metricRaw);
  return {
    key: asString(metric.key, asString(metric.label, "metric")),
    label: asString(metric.label),
    value: asNumberOrString(metric.value),
    unit: isDashboardUnit(metric.unit) ? metric.unit : undefined,
    tone: isDashboardTone(metric.tone) ? metric.tone : "default",
  };
};

const normalizeAction = (actionRaw: unknown): DashboardPriorityAction => {
  const action = asRecord(actionRaw);
  const cta = asRecord(action.cta);
  return {
    id: asString(action.id),
    type: isDashboardActionType(action.type) ? action.type : "production",
    urgency: isDashboardUrgency(action.urgency) ? action.urgency : "recommended",
    badge_label: asString(action.badge_label),
    title: asString(action.title),
    description: asString(action.description),
    cta: {
      label: asString(cta.label, asString(action.cta_label, "상세보기")),
      path: asString(cta.path, asString(action.cta_path, "/")),
    },
    focus_section: asString(action.focus_section) || undefined,
    related_sku_id: asString(action.related_sku_id) || undefined,
    ai_reasoning: asString(action.ai_reasoning) || undefined,
    confidence_score: typeof action.confidence_score === "number" ? action.confidence_score : undefined,
    is_finished_good: Boolean(action.is_finished_good),
    basis_data: action.basis_data as DashboardPriorityAction["basis_data"],
  };
};

const normalizeCard = (cardRaw: unknown): DashboardSummaryCard => {
  const card = asRecord(cardRaw);
  const highlightsText = Array.isArray(card.highlights_text)
    ? (card.highlights_text as string[])
    : Array.isArray(card.highlights)
      ? (card.highlights as string[])
      : [];

  const cta = asRecord(card.cta);
  return {
    domain: isDashboardDomain(card.domain) ? card.domain : "production",
    title: asString(card.title),
    description: asString(card.description),
    highlights_text: highlightsText,
    highlights_data: Array.isArray(card.highlights_data)
      ? (card.highlights_data as DashboardSummaryCard["highlights_data"])
      : [],
    metrics: Array.isArray(card.metrics) ? card.metrics.map(normalizeMetric) : [],
    cta: {
      label: asString(cta.label, asString(card.cta_label, "상세보기")),
      path: asString(cta.path, asString(card.cta_path, "/")),
    },
    prompts: Array.isArray(card.prompts) ? (card.prompts as string[]) : [],
    status_label: asString(card.status_label) || undefined,
    deadline_minutes: typeof card.deadline_minutes === "number" ? card.deadline_minutes : undefined,
    delivery_scheduled: typeof card.delivery_scheduled === "boolean" ? card.delivery_scheduled : undefined,
  };
};

const normalizeOverview = (rawData: unknown): DashboardOverviewResponse => {
  const raw = asRecord(rawData);
  return {
    updated_at: asString(raw.updated_at),
    priority_actions: Array.isArray(raw.priority_actions)
      ? raw.priority_actions.map(normalizeAction)
      : [],
    stats: Array.isArray(raw.stats) ? raw.stats.map(normalizeStat) : [],
    cards: Array.isArray(raw.cards) ? raw.cards.map(normalizeCard) : [],
  };
};

export const getDashboardOverview = async (
  params: DashboardOverviewRequest,
) => {
  const response = await axiosInstance.get<unknown>(
    "/api/home/overview",
    { params },
  );
  return normalizeOverview(response.data);
};
