import type { DemoRole } from "@/commons/components/layout/menu";

export interface SessionUser {
  id: string;
  name: string;
  role: DemoRole;
  roleLabel: string;
  email: string;
  initials: string;
  storeId: string;
  storeName: string;
  avatarUrl?: string;
}

const DEFAULT_DEMO_ROLE =
  (import.meta.env.VITE_DEFAULT_DEMO_ROLE as DemoRole | undefined) ?? "store_owner";
const DEFAULT_STORE_ID = import.meta.env.VITE_DEFAULT_STORE_ID ?? "STORE_DEMO";
const DEFAULT_STORE_NAME = import.meta.env.VITE_DEFAULT_STORE_NAME ?? "기본 매장";
const DEFAULT_USER_NAME = import.meta.env.VITE_DEFAULT_USER_NAME ?? DEFAULT_STORE_NAME;
const DEFAULT_USER_EMAIL = import.meta.env.VITE_DEFAULT_USER_EMAIL ?? "demo@store.local";
const DEFAULT_USER_INITIAL = DEFAULT_USER_NAME.charAt(0) || "점";

export const sessionUser: SessionUser = {
  id: "U-DEMO",
  name: DEFAULT_USER_NAME,
  role: DEFAULT_DEMO_ROLE,
  roleLabel: DEFAULT_DEMO_ROLE === "hq_admin" ? "본사 관리자" : "점주",
  email: DEFAULT_USER_EMAIL,
  initials: DEFAULT_USER_INITIAL,
  storeId: DEFAULT_STORE_ID,
  storeName: DEFAULT_STORE_NAME,
  avatarUrl:
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%25' stop-color='%23257bf4'/><stop offset='100%25' stop-color='%231c398e'/></linearGradient></defs><rect width='80' height='80' rx='40' fill='url(%23g)'/><circle cx='40' cy='30' r='14' fill='white' fill-opacity='0.95'/><path d='M16 66c4-11 14-18 24-18s20 7 24 18' fill='white' fill-opacity='0.95'/></svg>",
};
