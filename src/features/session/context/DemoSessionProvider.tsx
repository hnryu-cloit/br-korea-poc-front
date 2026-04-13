import { useMemo, useState, type PropsWithChildren } from "react";

import type { DemoRole } from "@/components/common/layout/menu";
import { sessionUser, type SessionUser } from "@/features/session/constants/session-user";
import { DemoSessionContext } from "@/features/session/context/demo-session-context";

const roleLabelMap: Record<DemoRole, string> = {
  hq_admin: "본사 관리자",
  store_owner: "가맹점주",
};

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
