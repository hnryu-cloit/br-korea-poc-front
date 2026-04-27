import { useEffect, useMemo, useState, type RefObject } from "react";

import {
  ChatBody,
  ChatHeader,
  type FloatingAiChatConversationItem,
  type FloatingAiChatSuggestion,
} from "@/commons/components/chat/FloatingAiChatParts";
import type { FloatingAiChatRouteGuide } from "@/commons/types/floating-ai-chat";

type FloatingAiChatPanelProps = {
  guide: FloatingAiChatRouteGuide;
  storeName: string;
  history: FloatingAiChatConversationItem[];
  suggestions: FloatingAiChatSuggestion[];
  scrollRef: RefObject<HTMLDivElement>;
  onClose: () => void;
  onSend: (prompt: string) => Promise<boolean>;
  isSending: boolean;
};

export function FloatingAiChatPanel({
  guide,
  storeName,
  history,
  suggestions,
  scrollRef,
  onClose,
  onSend,
  isSending,
}: FloatingAiChatPanelProps) {
  const [input, setInput] = useState("");

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [history, isSending, scrollRef]);

  const hasConversation = history.length > 0;
  const placeholder = useMemo(
    () => (hasConversation ? "이어 질문을 입력해 주세요." : "궁금한 내용을 바로 물어보세요."),
    [hasConversation],
  );

  const handleSubmit = async (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed || isSending) return false;
    const ok = await onSend(trimmed);
    if (ok) {
      setInput("");
    }
    return ok;
  };

  const handleQuestionClick = (prompt: string) => {
    void handleSubmit(prompt);
  };

  return (
    <div
      className="fixed bottom-30 right-6 z-50 flex h-[700px] w-[800px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[28px] border-[3px] border-[#FF671F] bg-[linear-gradient(90deg,#FFECE3_0%,#FFC6AB_100%)] p-3 shadow-[0_0_24px_0_rgba(50,56,62,0.20)]"
      style={{ maxHeight: "calc(100vh - 120px)" }}
    >
      <ChatHeader subtitle={guide.subtitle} storeName={storeName} onClose={onClose} />

      <ChatBody
        messages={history}
        suggestions={suggestions}
        onQuestionClick={handleQuestionClick}
        onRetry={handleQuestionClick}
        isSending={isSending}
        scrollRef={scrollRef}
        input={input}
        onChangeInput={setInput}
        onSubmit={() => void handleSubmit(input)}
        placeholder={placeholder}
      />
    </div>
  );
}
