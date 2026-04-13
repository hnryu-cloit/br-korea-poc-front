import { createContext } from "react";

import type { DemoRole } from "@/components/common/layout/menu";
import type { SessionUser } from "@/features/session/constants/session-user";

export type DemoSessionContextValue = {
  user: SessionUser;
  setRole: (role: DemoRole) => void;
};

export const DemoSessionContext = createContext<DemoSessionContextValue | undefined>(undefined);
