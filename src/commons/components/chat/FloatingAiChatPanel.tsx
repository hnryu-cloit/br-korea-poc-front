import { Send, Sparkles, X } from "lucide-react";
import { type RefObject, useState } from "react";

import type {
  ChatEntry,
  FloatingAiCardContextKey,
  FloatingAiChatRouteGuide,
} from "@/commons/types/floating-ai-chat";

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-[18px] rounded-br-sm bg-[#1f4dbb] px-4 py-2.5 text-sm text-white">
        {text}
      </div>
    </div>
  );
}

function AssistantBubble({ title, content, evidence }: { title: string; content: string; evidence: string[] }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] rounded-[18px] rounded-bl-sm border border-border bg-[#f8fbff] px-4 py-3">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-1.5 text-sm leading-6 text-slate-600">{content}</p>
        {evidence.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {evidence.map((item) => (
              <div key={item} className="rounded-xl bg-white px-3 py-1.5 text-xs text-slate-500 shadow-sm">
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function FloatingAiChatPanel({
  guide,
  history,
  cardContextKey,
  scrollRef,
  onClose,
  onSend,
}: {
  guide: FloatingAiChatRouteGuide;
  history: ChatEntry[];
  cardContextKey?: FloatingAiCardContextKey | null;
  scrollRef: RefObject<HTMLDivElement>;
  onClose: () => void;
  onSend: (prompt: string) => void;
}) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput("");
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex w-[360px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[28px] border border-[#d8e5ff] bg-white shadow-[0_24px_60px_rgba(31,77,187,0.2)]"
      style={{ maxHeight: "calc(100vh - 120px)" }}
    >
      {/* 헤더 */}
      <div className="shrink-0 flex items-start justify-between gap-4 bg-[linear-gradient(135deg,#1f4dbb_0%,#55a0ff_100%)] px-5 py-4 text-white">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
            <Sparkles className="h-3.5 w-3.5" />
            AI 도우미
            {cardContextKey ? (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
                카드 연동
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-base font-semibold">{guide.title}</p>
          <p className="mt-1 text-xs leading-5 text-white/80">{guide.subtitle}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="닫기">
          <X className="h-4 w-4 text-white/80" />
        </button>
      </div>

      {/* 추천 질문 */}
      <div className="shrink-0 border-b border-border/40 px-4 py-3">
        <p className="mb-2 text-xs font-semibold text-slate-400">바로 물어보기</p>
        <div className="flex flex-wrap gap-1.5">
          {guide.quickActions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => onSend(action.prompt)}
              className="rounded-full border border-[#d8e5ff] bg-[#f7faff] px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-[#eef4ff]"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* 대화 히스토리 */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
        style={{ minHeight: 0 }}
      >
        {history.map((entry, idx) =>
          entry.role === "user" ? (
            <UserBubble key={`user-${idx}-${entry.text}`} text={entry.text} />
          ) : (
            <AssistantBubble
              key={`assistant-${idx}-${entry.message.id}`}
              title={entry.message.title}
              content={entry.message.content}
              evidence={entry.message.evidence}
            />
          ),
        )}
      </div>

      {/* 입력창 */}
      <div className="shrink-0 border-t border-border/40 px-4 py-3">
        <div className="flex items-center gap-2 rounded-2xl border border-[#d8e5ff] bg-[#f7faff] px-4 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="궁금한 것을 물어보세요..."
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1f4dbb] text-white transition-opacity disabled:opacity-30"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
