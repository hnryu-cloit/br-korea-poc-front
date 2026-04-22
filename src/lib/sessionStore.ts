export const SESSION_KEYS = {
  BYPASS_ROLE: "bypassUserRole",
  STORE_ID: "selectedStoreId",
  STORE_NAME: "selectedStoreName",
  REFERENCE_DATETIME: "referenceDateTime",
} as const;

const ALLOWED_ROLES = new Set(["store_owner", "hq_admin", "hq_operator", "hq_planner"]);
const DEFAULT_ROLE = "store_owner";

export function getSessionRole(): string {
  if (typeof window === "undefined") return DEFAULT_ROLE;
  const stored = window.localStorage.getItem(SESSION_KEYS.BYPASS_ROLE);
  return stored && ALLOWED_ROLES.has(stored) ? stored : DEFAULT_ROLE;
}

export function getSessionStoreId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SESSION_KEYS.STORE_ID);
}

export function getSessionReferenceDateTime(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SESSION_KEYS.REFERENCE_DATETIME);
}
