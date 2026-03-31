import { createContext } from "react";

import type { SessionUser } from "@/data/session-user";
import type { DemoRole } from "@/data/navigation";

export type DemoSessionContextValue = {
  user: SessionUser;
  setRole: (role: DemoRole) => void;
};

export const DemoSessionContext = createContext<DemoSessionContextValue | undefined>(undefined);
