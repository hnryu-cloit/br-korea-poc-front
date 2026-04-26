import { createContext } from "react";

import type { FloatingAiCardContextKey } from "@/commons/types/floating-ai-chat";
import type { FloatingChatDomain } from "@/commons/utils/floating-ai-chat-session";

export type FloatingAiChatContextValue = {
  isOpen: boolean;
  activeCardContextKey: FloatingAiCardContextKey | null;
  pendingChat: { prompt: string; domain: FloatingChatDomain } | null;
  open: (cardContextKey?: FloatingAiCardContextKey) => void;
  close: () => void;
  openWithPrompt: (prompt: string, domain: FloatingChatDomain) => void;
  consumePendingChat: () => void;
};

export const FloatingAiChatContext = createContext<FloatingAiChatContextValue | undefined>(
  undefined,
);
