import type { ChatEntry } from "@/commons/types/floating-ai-chat";

const STORAGE_KEY = "floating-ai-chat-sessions-v2";

type SessionRecord = {
  history: ChatEntry[];
  updatedAt: string;
};

export type FloatingChatSessions = Record<string, SessionRecord>;

export const FLOATING_CHAT_DOMAIN_PREFIXES = ["/production", "/ordering", "/sales"] as const;

export type FloatingChatDomain = "production" | "ordering" | "sales";

export function resolveRouteContext(pathname: string): {
  sessionKey: string;
  domain: FloatingChatDomain;
} {
  if (pathname.startsWith("/production")) return { sessionKey: "/production", domain: "production" };
  if (pathname.startsWith("/ordering")) return { sessionKey: "/ordering", domain: "ordering" };
  return { sessionKey: pathname.startsWith("/sales") ? "/sales" : pathname, domain: "sales" };
}

export function readChatSessions(): FloatingChatSessions {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as FloatingChatSessions) : {};
  } catch {
    return {};
  }
}

export function writeChatSessions(sessions: FloatingChatSessions): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function saveSessionHistory(sessionKey: string, history: ChatEntry[]): void {
  const sessions = readChatSessions();
  sessions[sessionKey] = { history, updatedAt: new Date().toISOString() };
  writeChatSessions(sessions);
}

export function loadSessionHistory(sessionKey: string): ChatEntry[] | null {
  const sessions = readChatSessions();
  const saved = sessions[sessionKey];
  return saved?.history?.length ? saved.history : null;
}