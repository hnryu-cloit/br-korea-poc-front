import axiosInstance from "@/services/axiosInstance";

import type {
  DashboardOverviewRequest,
  DashboardOverviewResponse,
  DashboardMetricItem,
  DashboardPriorityAction,
  DashboardStatItem,
  DashboardSummaryCard,
} from "@/features/dashboard/types/dashboard";

const normalizeStat = (stat: any): DashboardStatItem => ({
  key: stat?.key,
  label: stat?.label ?? "",
  value: stat?.value ?? "",
  unit: stat?.unit,
  tone: stat?.tone ?? "default",
});

const normalizeMetric = (metric: any): DashboardMetricItem => ({
  key: metric?.key ?? metric?.label ?? "metric",
  label: metric?.label ?? "",
  value: metric?.value ?? "",
  unit: metric?.unit,
  tone: metric?.tone ?? "default",
});

const normalizeAction = (action: any): DashboardPriorityAction => ({
  id: action?.id ?? "",
  type: action?.type ?? "production",
  urgency: action?.urgency ?? "recommended",
  badge_label: action?.badge_label ?? "",
  title: action?.title ?? "",
  description: action?.description ?? "",
  cta: action?.cta ?? {
    label: action?.cta_label ?? "상세보기",
    path: action?.cta_path ?? "/",
  },
  focus_section: action?.focus_section,
  related_sku_id: action?.related_sku_id,
  ai_reasoning: action?.ai_reasoning,
  confidence_score: action?.confidence_score,
  is_finished_good: Boolean(action?.is_finished_good),
  basis_data: action?.basis_data,
});

const normalizeCard = (card: any): DashboardSummaryCard => {
  const highlightsText = Array.isArray(card?.highlights_text)
    ? card.highlights_text
    : Array.isArray(card?.highlights)
      ? card.highlights
      : [];

  return {
    domain: card?.domain ?? "production",
    title: card?.title ?? "",
    description: card?.description ?? "",
    highlights_text: highlightsText,
    highlights_data: Array.isArray(card?.highlights_data) ? card.highlights_data : [],
    metrics: Array.isArray(card?.metrics) ? card.metrics.map(normalizeMetric) : [],
    cta: card?.cta ?? {
      label: card?.cta_label ?? "상세보기",
      path: card?.cta_path ?? "/",
    },
    prompts: Array.isArray(card?.prompts) ? card.prompts : [],
    status_label: card?.status_label,
    deadline_minutes: card?.deadline_minutes,
    delivery_scheduled: card?.delivery_scheduled,
  };
};

const normalizeOverview = (raw: any): DashboardOverviewResponse => ({
  updated_at: raw?.updated_at ?? "",
  priority_actions: Array.isArray(raw?.priority_actions) ? raw.priority_actions.map(normalizeAction) : [],
  stats: Array.isArray(raw?.stats) ? raw.stats.map(normalizeStat) : [],
  cards: Array.isArray(raw?.cards) ? raw.cards.map(normalizeCard) : [],
});

export const getDashboardOverview = async (
  params: DashboardOverviewRequest,
) => {
  const response = await axiosInstance.get<DashboardOverviewResponse>(
    "/api/home/overview",
    { params },
  );
  return normalizeOverview(response.data);
};
