import { useMemo, useState, type PropsWithChildren } from "react";

import { FloatingAiChatContext } from "@/commons/contexts/floating-ai-chat-context";
import type { FloatingAiCardContextKey } from "@/commons/types/floating-ai-chat";

export function FloatingAiChatProvider({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCardContextKey, setActiveCardContextKey] = useState<FloatingAiCardContextKey | null>(null);

  const value = useMemo(
    () => ({
      isOpen,
      activeCardContextKey,
      open: (cardContextKey?: FloatingAiCardContextKey) => {
        setActiveCardContextKey(cardContextKey ?? null);
        setIsOpen(true);
      },
      close: () => {
        setIsOpen(false);
        setActiveCardContextKey(null);
      },
    }),
    [isOpen, activeCardContextKey],
  );

  return (
    <FloatingAiChatContext.Provider value={value}>
      {children}
    </FloatingAiChatContext.Provider>
  );
}