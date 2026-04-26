import { useEffect, useMemo, useRef, useState, type PropsWithChildren } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { analyticsQueryKeys } from "@/features/analytics/queries/analyticsQueryKeys";
import { dashboardQueryKeys } from "@/features/dashboard/queries/dashboardQueryKeys";
import type { DemoRole } from "@/commons/components/layout/menu";
import {
  sessionDefaults,
  sessionUser,
  type SessionUser,
} from "@/features/session/constants/session-user";
import { DemoSessionContext } from "@/features/session/context/demo-session-context";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";
import { SESSION_KEYS } from "@/lib/sessionStore";

const roleLabelMap: Record<DemoRole, string> = {
  hq_admin: "본사 관리자",
  store_owner: "가맹점주",
};

const invalidationRoots = [
  dashboardQueryKeys.all,
  ["production"] as const,
  ["ordering"] as const,
  ["sales"] as const,
  analyticsQueryKeys.all,
] as const;

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

function loadInitialReferenceDateTime(): string {
  if (typeof window === "undefined") {
    return sessionDefaults.referenceDateTime;
  }
  return (
    window.localStorage.getItem(SESSION_KEYS.REFERENCE_DATETIME) ??
    sessionDefaults.referenceDateTime
  );
}

function ReferenceDateQueryInvalidator() {
  const queryClient = useQueryClient();
  const { referenceDateTime } = useDemoSession();
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    for (const queryKey of invalidationRoots) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, [queryClient, referenceDateTime]);

  return null;
}

export function DemoSessionProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<SessionUser>(loadInitialUser);
  const [referenceDateTime, setReferenceDateTimeState] = useState<string>(
    loadInitialReferenceDateTime,
  );

  const value = useMemo(
    () => ({
      user,
      referenceDateTime,
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
      setReferenceDateTime: (nextReferenceDateTime: string) => {
        const normalized = nextReferenceDateTime || sessionDefaults.referenceDateTime;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(SESSION_KEYS.REFERENCE_DATETIME, normalized);
        }
        setReferenceDateTimeState(normalized);
      },
      resetReferenceDateTime: () => {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            SESSION_KEYS.REFERENCE_DATETIME,
            sessionDefaults.referenceDateTime,
          );
        }
        setReferenceDateTimeState(sessionDefaults.referenceDateTime);
      },
    }),
    [referenceDateTime, user],
  );

  return (
    <DemoSessionContext.Provider value={value}>
      <ReferenceDateQueryInvalidator />
      {children}
    </DemoSessionContext.Provider>
  );
}
