import { useMemo, useState, type PropsWithChildren } from "react";

import { FloatingAiChatContext } from "@/commons/contexts/floating-ai-chat-context";
import type { FloatingAiCardContextKey } from "@/commons/types/floating-ai-chat";
import type { FloatingChatDomain } from "@/commons/utils/floating-ai-chat-session";

export function FloatingAiChatProvider({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCardContextKey, setActiveCardContextKey] = useState<FloatingAiCardContextKey | null>(
    null,
  );
  const [pendingChat, setPendingChat] = useState<{
    prompt: string;
    domain: FloatingChatDomain;
  } | null>(null);

  const value = useMemo(
    () => ({
      isOpen,
      activeCardContextKey,
      pendingChat,
      open: (cardContextKey?: FloatingAiCardContextKey) => {
        setActiveCardContextKey(cardContextKey ?? null);
        setIsOpen(true);
      },
      close: () => {
        setIsOpen(false);
        setActiveCardContextKey(null);
      },
      openWithPrompt: (prompt: string, domain: FloatingChatDomain) => {
        setPendingChat({ prompt, domain });
        setIsOpen(true);
      },
      consumePendingChat: () => {
        setPendingChat(null);
      },
    }),
    [isOpen, activeCardContextKey, pendingChat],
  );

  return <FloatingAiChatContext.Provider value={value}>{children}</FloatingAiChatContext.Provider>;
}
