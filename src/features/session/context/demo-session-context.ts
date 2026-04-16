import { createContext } from "react";

import type { DemoRole } from "@/commons/components/layout/menu";
import type { SessionUser } from "@/features/session/constants/session-user";

export type DemoSessionContextValue = {
  user: SessionUser;
  setRole: (role: DemoRole) => void;
  setStore: (storeId: string, storeName: string) => void;
};

export const DemoSessionContext = createContext<DemoSessionContextValue | undefined>(undefined);
