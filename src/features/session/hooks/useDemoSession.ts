import { useContext } from "react";

import { DemoSessionContext } from "@/features/session/context/demo-session-context";

export function useDemoSession() {
  const context = useContext(DemoSessionContext);
  if (!context) {
    throw new Error("useDemoSession must be used within DemoSessionProvider");
  }
  return context;
}
