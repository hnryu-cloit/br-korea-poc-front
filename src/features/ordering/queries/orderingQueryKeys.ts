import type {
  OrderingAlertsParams,
  OrderingDeadlineParams,
  OrderingHistoryParams,
  OrderingOptionsParams,
  OrderingSelectionHistoryParams,
  OrderingSelectionSummaryParams,
} from "@/features/ordering/types/ordering";

const ORDERING_QUERY_ROOT = ["ordering"] as const;

export const orderingQueryKeys = {
  all: ORDERING_QUERY_ROOT,
  options: (params?: OrderingOptionsParams) =>
    [...ORDERING_QUERY_ROOT, "options", params ?? {}] as const,
  context: (notificationId: number) => [...ORDERING_QUERY_ROOT, "context", notificationId] as const,
  alerts: (params?: OrderingAlertsParams) =>
    [...ORDERING_QUERY_ROOT, "alerts", params ?? {}] as const,
  selectionHistory: (params?: OrderingSelectionHistoryParams) =>
    [...ORDERING_QUERY_ROOT, "selection-history", params ?? {}] as const,
  deadline: (params?: OrderingDeadlineParams) =>
    [...ORDERING_QUERY_ROOT, "deadline", params ?? {}] as const,
  selectionSummary: (params?: OrderingSelectionSummaryParams) =>
    [...ORDERING_QUERY_ROOT, "selection-summary", params ?? {}] as const,
  history: (params?: OrderingHistoryParams) =>
    [...ORDERING_QUERY_ROOT, "history", params ?? {}] as const,
  historyInsights: (params?: OrderingHistoryParams) =>
    [...ORDERING_QUERY_ROOT, "history-insights", params ?? {}] as const,
};
