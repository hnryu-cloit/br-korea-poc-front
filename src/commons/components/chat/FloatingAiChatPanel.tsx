import ai_pencil from "@/assets/ai-pencil.svg";
import brown_donut from "@/assets/donut-brown.svg";
import { ArrowUpIcon, X } from "lucide-react";
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

function AssistantBubble({
  title,
  content,
  evidence,
}: {
  title: string;
  content: string;
  evidence: string[];
}) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] flex flex-col gap-3">
        {/* <p className="text-sm font-semibold text-slate-900">{title}</p> */}
        <p className="px-5 py-4 rounded-[8px] bg-[#F1F5F9] text-brown-700 text-[18px] font-bold">
          {content}
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5">
            <img src={brown_donut} className="w-6" />
            <p className="text-brown-700 text-md font-bold">자주 묻는 질문</p>
          </div>
          {evidence.length > 0 && (
            <>
              {evidence.map((item) => (
                <div
                  key={item}
                  className="w-fit rounded-[16px] border-[2px] border-transparent bg-[linear-gradient(#fff,#fff),linear-gradient(180deg,#FF6E00_0%,#DA1884_100%)] [background-origin:border-box] [background-clip:padding-box,border-box] px-5 py-2 text-md font-bold text-[#DA1884]"
                >
                  {item}
                </div>
              ))}
            </>
          )}
        </div>
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
    <div
      className="fixed bottom-24 right-6 z-50 flex w-[800px] h-[700px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[28px] p-3 border border-[#99115C] border-3 bg-gradient-to-r from-[#FFECE3] to-[#DC8AB7] flex flex-col gap-5 shadow-[0_24px_60px_rgba(31,77,187,0.2)]"
      style={{ maxHeight: "calc(100vh - 120px)" }}
    >
      {/* 헤더 */}
      <div className="shrink-0 flex items-start justify-between px-3 py-4">
        <div className="flex flex-col gap-3">
          <p className="text-[#99115C] font-bold text-md">안녕하세요, 점주님</p>
          <div className="flex items-center gap-3">
            <img src={ai_pencil} className="w-[28px]" />
            <p className="text-brown-700 text-[18px] font-medium">
              발주부터 재고 관리까지, 빠르고 정확하게 도와드릴게요
              <br />
              어떤 작업이 필요하신가요?
            </p>
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="닫기">
          <X className="h-[28px] w-[28px] text-brown-700" />
        </button>
      </div>

      <div className="rounded-[12px] bg-white px-6 py-4 h-full flex flex-col gap-2">
        {/* 대화 히스토리 */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto" style={{ minHeight: 0 }}>
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
        <div className="flex items-center gap-2 rounded-[16px] border border-[#CAD5E2] bg-white px-4.5 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="궁금한 것을 물어보세요."
            className="flex-1 bg-transparent text-md text-brown-700 placeholder-[#90A1B9] outline-none"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex h-8 w-8 items-center justify-center rounded-full p-1 bg-orange-500 text-white transition-opacity disabled:bg-[#FFD9C7]"
          >
            <ArrowUpIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
