import type { DashboardDomain } from "@/features/dashboard/types/dashboard";

export interface DashboardCardChatHistoryItem {
  id: string;
  question: string;
  answer: string;
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

const canUseSessionStorage = () => typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";

const readStore = (): DashboardCardChatHistoryStore => {
  if (!canUseSessionStorage()) return EMPTY_HISTORY_STORE;
  try {
    const raw = window.sessionStorage.getItem(DASHBOARD_CARD_CHAT_HISTORY_KEY);
    if (!raw) return EMPTY_HISTORY_STORE;
    const parsed = JSON.parse(raw) as Partial<DashboardCardChatHistoryStore>;
    return {
      production: Array.isArray(parsed.production) ? parsed.production : [],
      ordering: Array.isArray(parsed.ordering) ? parsed.ordering : [],
      sales: Array.isArray(parsed.sales) ? parsed.sales : [],
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
) => {
  const trimmedQuestion = question.trim();
  const trimmedAnswer = answer.trim();
  if (!trimmedQuestion || !trimmedAnswer) return;

  const current = readStore();
  const nextItem: DashboardCardChatHistoryItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    question: trimmedQuestion,
    answer: trimmedAnswer,
    createdAt: new Date().toISOString(),
  };

  writeStore({
    ...current,
    [domain]: [...current[domain], nextItem],
  });
};

export const getDashboardCardChatHistory = (domain: DashboardDomain): DashboardCardChatHistoryItem[] =>
  readStore()[domain];
