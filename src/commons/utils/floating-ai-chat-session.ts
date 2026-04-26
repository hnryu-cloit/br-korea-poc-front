const STORAGE_KEY = "floating-ai-chat-sessions-v2";

type SessionRecord = {
  history: unknown[];
  updatedAt: string;
};

export type FloatingChatSessions = Record<string, SessionRecord>;

export const FLOATING_CHAT_DOMAIN_PREFIXES = ["/production", "/ordering", "/sales"] as const;

export type FloatingChatDomain = "production" | "ordering" | "sales";

export function resolveRouteContext(pathname: string): {
  sessionKey: string;
  domain: FloatingChatDomain;
} {
  if (pathname.startsWith("/production")) {
    return { sessionKey: pathname, domain: "production" };
  }
  if (pathname.startsWith("/ordering")) {
    return { sessionKey: pathname, domain: "ordering" };
  }
  if (pathname.startsWith("/sales")) {
    return { sessionKey: pathname, domain: "sales" };
  }
  return { sessionKey: pathname, domain: "sales" };
}

export function readChatSessions(): FloatingChatSessions {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as FloatingChatSessions) : {};
  } catch {
    return {};
  }
}

export function writeChatSessions(sessions: FloatingChatSessions): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function saveSessionHistory(sessionKey: string, history: unknown[]): void {
  const sessions = readChatSessions();
  sessions[sessionKey] = { history, updatedAt: new Date().toISOString() };
  writeChatSessions(sessions);
}

export function loadSessionHistory(sessionKey: string): unknown[] | null {
  const sessions = readChatSessions();
  const saved = sessions[sessionKey];
  return saved?.history?.length ? saved.history : null;
}
