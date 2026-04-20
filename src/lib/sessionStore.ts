export const SESSION_KEYS = {
  BYPASS_ROLE: "bypassUserRole",
  STORE_ID: "selectedStoreId",
  STORE_NAME: "selectedStoreName",
} as const;

const ALLOWED_ROLES = new Set(["store_owner", "hq_admin", "hq_operator", "hq_planner"]);
const DEFAULT_ROLE = "store_owner";

export function getSessionRole(): string {
  if (typeof window === "undefined") return DEFAULT_ROLE;
  const stored = window.localStorage.getItem(SESSION_KEYS.BYPASS_ROLE);
  return stored && ALLOWED_ROLES.has(stored) ? stored : DEFAULT_ROLE;
}
