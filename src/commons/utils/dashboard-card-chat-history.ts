import type { DashboardDomain } from "@/features/dashboard/types/dashboard";

export interface DashboardCardChatHistoryItem {
  id: string;
  question: string;
  answer: string;
  evidence: string[];
  actions: string[];
  createdAt: string;
}

interface DashboardCardChatHistoryStore {
  production: DashboardCardChatHistoryItem[];
  ordering: DashboardCardChatHistoryItem[];
  sales: DashboardCardChatHistoryItem[];
}

const DASHBOARD_CARD_CHAT_HISTORY_KEY = "dashboard-card-chat-history-v1";

const EMPTY_HISTORY_STORE: DashboardCardChatHistoryStore = {
  production: [],
  ordering: [],
  sales: [],
};

const canUseSessionStorage = () =>
  typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";

const readStore = (): DashboardCardChatHistoryStore => {
  if (!canUseSessionStorage()) return EMPTY_HISTORY_STORE;
  try {
    const raw = window.sessionStorage.getItem(DASHBOARD_CARD_CHAT_HISTORY_KEY);
    if (!raw) return EMPTY_HISTORY_STORE;
    const parsed = JSON.parse(raw) as Partial<DashboardCardChatHistoryStore>;

    const normalizeItems = (items: unknown): DashboardCardChatHistoryItem[] =>
      Array.isArray(items)
        ? items
            .filter(
              (item): item is Partial<DashboardCardChatHistoryItem> =>
                !!item && typeof item === "object",
            )
            .map((item) => ({
              id:
                typeof item.id === "string"
                  ? item.id
                  : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
              question: typeof item.question === "string" ? item.question : "",
              answer: typeof item.answer === "string" ? item.answer : "",
              evidence: Array.isArray(item.evidence)
                ? item.evidence.filter((entry): entry is string => typeof entry === "string")
                : [],
              actions: Array.isArray(item.actions)
                ? item.actions.filter((entry): entry is string => typeof entry === "string")
                : [],
              createdAt:
                typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
            }))
            .filter((item) => item.question.trim() && item.answer.trim())
        : [];

    return {
      production: normalizeItems(parsed.production),
      ordering: normalizeItems(parsed.ordering),
      sales: normalizeItems(parsed.sales),
    };
  } catch {
    return EMPTY_HISTORY_STORE;
  }
};

const writeStore = (store: DashboardCardChatHistoryStore) => {
  if (!canUseSessionStorage()) return;
  window.sessionStorage.setItem(DASHBOARD_CARD_CHAT_HISTORY_KEY, JSON.stringify(store));
};

export const appendDashboardCardChatHistory = (
  domain: DashboardDomain,
  question: string,
  answer: string,
  metadata?: {
    evidence?: string[];
    actions?: string[];
  },
): DashboardCardChatHistoryItem | null => {
  const trimmedQuestion = question.trim();
  const trimmedAnswer = answer.trim();
  if (!trimmedQuestion || !trimmedAnswer) return null;

  const current = readStore();
  const nextItem: DashboardCardChatHistoryItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    question: trimmedQuestion,
    answer: trimmedAnswer,
    evidence: Array.isArray(metadata?.evidence) ? metadata.evidence : [],
    actions: Array.isArray(metadata?.actions) ? metadata.actions : [],
    createdAt: new Date().toISOString(),
  };

  writeStore({
    ...current,
    [domain]: [...current[domain], nextItem],
  });
  return nextItem;
};

export const getDashboardCardChatHistory = (
  domain: DashboardDomain,
): DashboardCardChatHistoryItem[] => readStore()[domain];

export const consumeDashboardCardChatHistory = (
  domain: DashboardDomain,
  chatHistoryId?: string,
): DashboardCardChatHistoryItem[] => {
  const current = readStore();
  const targetItems = current[domain];
  if (targetItems.length === 0) return [];

  if (!chatHistoryId) {
    writeStore({
      ...current,
      [domain]: [],
    });
    return targetItems;
  }

  const consumedItem = targetItems.find((item) => item.id === chatHistoryId);
  if (!consumedItem) return [];

  writeStore({
    ...current,
    [domain]: targetItems.filter((item) => item.id !== chatHistoryId),
  });
  return [consumedItem];
};
