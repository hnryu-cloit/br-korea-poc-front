import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";

import { sessionUser, type SessionUser } from "../data/session-user";
import type { DemoRole } from "../data/navigation";

type DemoSessionContextValue = {
  user: SessionUser;
  setRole: (role: DemoRole) => void;
};

const roleLabelMap: Record<DemoRole, string> = {
  hq_admin: "본사 관리자",
  supervisor: "수퍼바이저",
  store_owner: "가맹점주",
};

const DemoSessionContext = createContext<DemoSessionContextValue | undefined>(undefined);
const BYPASS_ROLE_KEY = "bypassUserRole";

export function DemoSessionProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<SessionUser>(() => {
    if (typeof window === "undefined") {
      return sessionUser;
    }

    const storedRole = window.localStorage.getItem(BYPASS_ROLE_KEY) as DemoRole | null;
    if (!storedRole || !(storedRole in roleLabelMap)) {
      return sessionUser;
    }

    return {
      ...sessionUser,
      role: storedRole,
      roleLabel: roleLabelMap[storedRole],
    };
  });

  const value = useMemo(
    () => ({
      user,
      setRole: (role: DemoRole) => {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(BYPASS_ROLE_KEY, role);
        }
        setUser((current) => ({
          ...current,
          role,
          roleLabel: roleLabelMap[role],
        }));
      },
    }),
    [user],
  );

  return <DemoSessionContext.Provider value={value}>{children}</DemoSessionContext.Provider>;
}

export function useDemoSession() {
  const context = useContext(DemoSessionContext);
  if (!context) {
    throw new Error("useDemoSession must be used within DemoSessionProvider");
  }
  return context;
}
