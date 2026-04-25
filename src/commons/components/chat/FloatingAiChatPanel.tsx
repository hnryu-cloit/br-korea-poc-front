import ai_pencil from "@/assets/ai-pencil.svg";
import brown_donut from "@/assets/donut-brown.svg";
import { ArrowUpIcon, X } from "lucide-react";
import { type RefObject, useState } from "react";

import type {
  ChatEntry,
  FloatingAiChatMessage,
  FloatingAiChatRouteGuide,
} from "@/commons/types/floating-ai-chat";

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-[24px] bg-[#F1F5F9] px-4 py-2.5 text-md text-brown-700">
        {text}
      </div>
    </div>
  );
}

function AssistantBubble({
  message,
  onQuickAsk,
}: {
  message: FloatingAiChatMessage;
  onQuickAsk: (prompt: string) => void;
}) {
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const suggestedQuestions = message.suggestedQuestions ?? [];
  const reference = message.reference;
  const isGoldenQueryMiss =
    !message.matchedQueryId &&
    typeof message.processingRoute === "string" &&
    message.processingRoute.includes("golden_query_miss");
  const hasReference =
    Boolean(reference?.sql) ||
    Boolean(reference?.semanticLogic) ||
    (reference?.sources?.length ?? 0) > 0 ||
    (reference?.relevantTables?.length ?? 0) > 0 ||
    Boolean(reference?.queriedPeriod) ||
    (reference?.dataLineage?.length ?? 0) > 0 ||
    Boolean(reference?.matchedQueryId);

  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] flex flex-col gap-3">
        <p className="px-5 py-4 rounded-[8px] bg-[#F1F5F9] text-brown-700 text-[18px] font-bold">
          {message.content}
        </p>

        {message.evidence.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {message.evidence.map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="rounded-[12px] bg-[#F8FAFC] px-3 py-1.5 text-[12px] font-semibold text-[#475569]"
              >
                {item}
              </span>
            ))}
          </div>
        ) : null}

        {suggestedQuestions.length > 0 ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <img src={brown_donut} className="w-6" />
              <p className="text-brown-700 text-md font-bold">자주 묻는 질문</p>
            </div>
            <div className="flex flex-col gap-2">
              {suggestedQuestions.map((item, index) => (
                <button
                  key={`${item}-${index}`}
                  type="button"
                  onClick={() => onQuickAsk(item)}
                  className="w-fit rounded-[16px] border-[2px] border-transparent bg-[linear-gradient(#fff,#fff),linear-gradient(180deg,#FF6E00_0%,#DA1884_100%)] [background-origin:border-box] [background-clip:padding-box,border-box] px-5 py-2 text-left text-md font-bold text-[#DA1884]"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {message.matchedQueryId ? (
          <span className="w-fit rounded-full bg-[#E5FAF6] px-3 py-1 text-[11px] font-bold text-[#00B89C]">
            골든쿼리 매칭: {message.matchedQueryId}
          </span>
        ) : null}
        {isGoldenQueryMiss ? (
          <span className="w-fit rounded-full bg-[#FFF4E5] px-3 py-1 text-[11px] font-bold text-[#B45309]">
            골든쿼리 미매칭
          </span>
        ) : null}

        {hasReference ? (
          <>
            <button
              type="button"
              onClick={() => setIsReferenceOpen(true)}
              className="w-fit rounded-full border border-[#CBD5E1] bg-white px-3 py-1 text-[11px] font-bold text-[#475569]"
            >
              출처
            </button>
            {isReferenceOpen ? (
              <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 px-4">
                <div className="w-full max-w-[720px] rounded-[16px] bg-white p-5 shadow-xl">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[18px] font-bold text-brown-700">출처 및 근거</p>
                    <button
                      type="button"
                      onClick={() => setIsReferenceOpen(false)}
                      className="rounded-md px-2 py-1 text-sm font-semibold text-[#475569] hover:bg-[#F1F5F9]"
                    >
                      닫기
                    </button>
                  </div>

                  {reference?.sources?.length ? (
                    <div className="mb-4">
                      <p className="mb-2 text-sm font-bold text-[#475569]">출처</p>
                      <div className="flex flex-wrap gap-2">
                        {reference.sources.map((item, index) => (
                          <span
                            key={`${item}-${index}`}
                            className="rounded-[12px] bg-[#F8FAFC] px-3 py-1.5 text-[12px] font-semibold text-[#475569]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {reference?.semanticLogic ? (
                    <div className="mb-4">
                      <p className="mb-2 text-sm font-bold text-[#475569]">Gemini 판단 근거</p>
                      <p className="rounded-[10px] bg-[#F8FAFC] p-3 text-sm text-[#334155]">
                        {reference.semanticLogic}
                      </p>
                    </div>
                  ) : null}

                  {reference?.sql ? (
                    <div className="mb-4">
                      <p className="mb-2 text-sm font-bold text-[#475569]">참고한 쿼리</p>
                      <pre className="max-h-[160px] overflow-auto rounded-[10px] bg-[#0F172A] p-3 text-[12px] text-[#E2E8F0]">
                        {reference.sql}
                      </pre>
                    </div>
                  ) : null}

                  {(reference?.relevantTables?.length ?? 0) > 0 ? (
                    <div className="mb-4">
                      <p className="mb-2 text-sm font-bold text-[#475569]">관련 테이블</p>
                      <div className="flex flex-wrap gap-2">
                        {reference?.relevantTables?.map((item, index) => (
                          <span
                            key={`${item}-${index}`}
                            className="rounded-[12px] bg-[#EEF2FF] px-3 py-1.5 text-[12px] font-semibold text-[#4338CA]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {reference?.queriedPeriod ? (
                    <div className="mb-4">
                      <p className="mb-2 text-sm font-bold text-[#475569]">조회 기간</p>
                      <pre className="overflow-auto rounded-[10px] bg-[#F8FAFC] p-3 text-[12px] text-[#334155]">
                        {JSON.stringify(reference.queriedPeriod, null, 2)}
                      </pre>
                    </div>
                  ) : null}

                  {reference?.matchedQueryId ? (
                    <p className="text-sm font-semibold text-[#0F766E]">
                      골든쿼리 매칭: {reference.matchedQueryId}
                      {typeof reference.matchScore === "number"
                        ? ` (score ${reference.matchScore.toFixed(3)})`
                        : ""}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}

export function FloatingAiChatPanel({
  guide,
  storeName,
  history,
  scrollRef,
  onClose,
  onSend,
  isSending,
}: {
  guide: FloatingAiChatRouteGuide;
  storeName: string;
  history: ChatEntry[];
  scrollRef: RefObject<HTMLDivElement>;
  onClose: () => void;
  onSend: (prompt: string) => void;
  isSending: boolean;
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
      className="fixed bottom-24 right-6 z-50 flex h-[700px] w-[800px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[28px] border border-[#99115C] border-3 bg-gradient-to-r from-[#FFECE3] to-[#DC8AB7] p-3 shadow-[0_24px_60px_rgba(31,77,187,0.2)]"
      style={{ maxHeight: "calc(100vh - 120px)" }}
    >
      <div className="flex shrink-0 items-start justify-between px-3 py-4">
        <div className="flex flex-col gap-3">
          <p className="text-[#99115C] font-bold text-md">안녕하세요, {storeName} 점주님</p>
          <div className="flex items-center gap-3">
            <img src={ai_pencil} className="w-[28px]" />
            <p className="text-brown-700 text-[18px] font-medium">
              {guide.subtitle}
              <br />
              어떤 작업이 필요하신가요?
            </p>
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="닫기">
          <X className="h-[28px] w-[28px] text-brown-700" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden rounded-[12px] bg-white px-6 py-4">
        <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto">
          {history.map((entry, idx) =>
            entry.role === "user" ? (
              <UserBubble key={`entry-${idx}`} text={entry.text} />
            ) : (
              <AssistantBubble key={`entry-${idx}`} message={entry.message} onQuickAsk={onSend} />
            ),
          )}
        </div>

        <div className="shrink-0 flex items-center gap-2 rounded-[16px] border border-[#CAD5E2] bg-white px-4.5 py-2">
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
            disabled={isSending}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className="flex h-8 w-8 items-center justify-center rounded-full p-1 bg-orange-500 text-white transition-opacity disabled:bg-[#FFD9C7]"
          >
            <ArrowUpIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
