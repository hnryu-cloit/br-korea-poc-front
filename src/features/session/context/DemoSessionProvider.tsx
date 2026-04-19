import { useMemo, useState, type PropsWithChildren } from "react";

import type { DemoRole } from "@/commons/components/layout/menu";
import { sessionUser, type SessionUser } from "@/features/session/constants/session-user";
import { DemoSessionContext } from "@/features/session/context/demo-session-context";
import { SESSION_KEYS } from "@/lib/sessionStore";

const roleLabelMap: Record<DemoRole, string> = {
  hq_admin: "본사 관리자",
  store_owner: "가맹점주",
};

function getInitials(storeName: string): string {
  return storeName.charAt(0);
}

function loadInitialUser(): SessionUser {
  if (typeof window === "undefined") {
    return sessionUser;
  }

  const storedRole = window.localStorage.getItem(SESSION_KEYS.BYPASS_ROLE) as DemoRole | null;
  const storedStoreId = window.localStorage.getItem(SESSION_KEYS.STORE_ID);
  const storedStoreName = window.localStorage.getItem(SESSION_KEYS.STORE_NAME);

  const base = { ...sessionUser };

  if (storedRole && storedRole in roleLabelMap) {
    base.role = storedRole;
    base.roleLabel = roleLabelMap[storedRole];
  }

  if (storedStoreId && storedStoreName) {
    base.storeId = storedStoreId;
    base.storeName = storedStoreName;
    base.name = storedStoreName;
    base.initials = getInitials(storedStoreName);
  }

  return base;
}

export function DemoSessionProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<SessionUser>(loadInitialUser);

  const value = useMemo(
    () => ({
      user,
      setRole: (role: DemoRole) => {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(SESSION_KEYS.BYPASS_ROLE, role);
        }
        setUser((current) => ({
          ...current,
          role,
          roleLabel: roleLabelMap[role],
        }));
      },
      setStore: (storeId: string, storeName: string) => {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(SESSION_KEYS.STORE_ID, storeId);
          window.localStorage.setItem(SESSION_KEYS.STORE_NAME, storeName);
        }
        setUser((current) => ({
          ...current,
          storeId,
          storeName,
          name: storeName,
          initials: getInitials(storeName),
        }));
      },
    }),
    [user],
  );

  return <DemoSessionContext.Provider value={value}>{children}</DemoSessionContext.Provider>;
}
