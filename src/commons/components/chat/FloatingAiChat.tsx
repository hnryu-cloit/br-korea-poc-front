import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { FloatingAiChatButton } from "@/commons/components/chat/FloatingAiChatButton";
import { FloatingAiChatPanel } from "@/commons/components/chat/FloatingAiChatPanel";
import { floatingAiChatRouteGuides } from "@/commons/constants/floating-ai-chat";
import type { FloatingAiChatMessage } from "@/commons/types/floating-ai-chat";
import { buildFloatingAiReply } from "@/commons/utils/build-floating-ai-reply";

export function FloatingAiChat() {
  const location = useLocation();
  const guide = useMemo(
    () => floatingAiChatRouteGuides[location.pathname] ?? floatingAiChatRouteGuides["/"],
    [location.pathname],
  );
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<FloatingAiChatMessage>(() =>
    buildFloatingAiReply(location.pathname, guide.quickActions[0].prompt),
  );

  const runAction = (prompt: string) => {
    setMessage(buildFloatingAiReply(location.pathname, prompt));
    setIsOpen(true);
  };

  return (
    <>
      <FloatingAiChatButton onClick={() => setIsOpen((value) => !value)} />
      {isOpen ? (
        <FloatingAiChatPanel
          guide={guide}
          message={message}
          onClose={() => setIsOpen(false)}
          onRunAction={runAction}
        />
      ) : null}
    </>
  );
}
