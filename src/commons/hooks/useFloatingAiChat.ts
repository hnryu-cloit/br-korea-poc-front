import { useContext } from "react";

import { FloatingAiChatContext } from "@/commons/contexts/floating-ai-chat-context";

export function useFloatingAiChat() {
  const context = useContext(FloatingAiChatContext);
  if (!context) {
    throw new Error("useFloatingAiChat must be used within FloatingAiChatProvider");
  }
  return context;
}
