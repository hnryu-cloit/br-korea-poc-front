import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { FloatingAiChatButton } from "@/commons/components/chat/FloatingAiChatButton";
import { FloatingAiChatPanel } from "@/commons/components/chat/FloatingAiChatPanel";
import { floatingAiCardContexts } from "@/commons/constants/floating-ai-card-contexts";
import { floatingAiChatRouteGuides } from "@/commons/constants/floating-ai-chat";
import { useFloatingAiChat } from "@/commons/hooks/useFloatingAiChat";
import type { ChatEntry, FloatingAiChatRouteGuide } from "@/commons/types/floating-ai-chat";
import { buildFloatingAiReply } from "@/commons/utils/build-floating-ai-reply";

export function FloatingAiChat() {
  const location = useLocation();
  const { isOpen, activeCardContextKey, open, close } = useFloatingAiChat();

  const routeGuide = useMemo(
    () => floatingAiChatRouteGuides[location.pathname] ?? floatingAiChatRouteGuides["/"],
    [location.pathname],
  );

  const activeCardContext = activeCardContextKey
    ? floatingAiCardContexts[activeCardContextKey]
    : null;

  const guide: FloatingAiChatRouteGuide = activeCardContext
    ? {
        title: activeCardContext.cardTitle,
        subtitle: "선택한 카드에 맞는 AI 분석을 바로 확인합니다.",
        quickActions: activeCardContext.quickActions,
      }
    : routeGuide;

  const buildInitialHistory = useCallback(
    (): ChatEntry[] => [
      {
        role: "assistant",
        message: buildFloatingAiReply(
          location.pathname,
          guide.quickActions[0].prompt,
          activeCardContextKey,
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [history, setHistory] = useState<ChatEntry[]>(buildInitialHistory);

  // 카드 컨텍스트가 바뀌면 히스토리 초기화
  useEffect(() => {
    setHistory([
      {
        role: "assistant",
        message: buildFloatingAiReply(
          location.pathname,
          guide.quickActions[0].prompt,
          activeCardContextKey,
        ),
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCardContextKey]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const send = (prompt: string) => {
    const userEntry: ChatEntry = { role: "user", text: prompt };
    const aiEntry: ChatEntry = {
      role: "assistant",
      message: buildFloatingAiReply(location.pathname, prompt, activeCardContextKey),
    };
    setHistory((prev) => [...prev, userEntry, aiEntry]);
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  };

  return (
    <>
      <FloatingAiChatButton onClick={() => (isOpen ? close() : open())} />
      {isOpen ? (
        <FloatingAiChatPanel
          guide={guide}
          history={history}
          cardContextKey={activeCardContextKey}
          scrollRef={scrollRef}
          onClose={close}
          onSend={send}
        />
      ) : null}
    </>
  );
}
