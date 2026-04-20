import { createContext } from "react";

import type { FloatingAiCardContextKey } from "@/commons/types/floating-ai-chat";

export type FloatingAiChatContextValue = {
  isOpen: boolean;
  activeCardContextKey: FloatingAiCardContextKey | null;
  open: (cardContextKey?: FloatingAiCardContextKey) => void;
  close: () => void;
};

export const FloatingAiChatContext = createContext<FloatingAiChatContextValue | undefined>(
  undefined,
);
