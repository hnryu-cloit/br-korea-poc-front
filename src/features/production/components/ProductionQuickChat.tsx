import { Send } from "lucide-react";
import { useState } from "react";

import { usePostSalesQueryMutation } from "@/features/sales/queries/usePostSalesQueryMutation";

interface ProductionQuickChatMessage {
  id: number;
  role: "user" | "assistant";
  text: string;
}

let productionChatMessageId = 1;

const FALLBACK_QUICK_QUESTIONS = [
  "지금 생산해야 할 품목은?",
  "찬스 로스를 어떻게 줄이나요?",
  "1시간 후 재고 예측 기준은?",
  "4주 평균 패턴은 어떻게 계산하나요?",
];

export function ProductionQuickChat() {
  const [messages, setMessages] = useState<ProductionQuickChatMessage[]>([]);
  const [input, setInput] = useState("");
  const postSalesQueryMutation = usePostSalesQueryMutation();

  const suggestedQuestions = FALLBACK_QUICK_QUESTIONS;

  const sendMessage = async (rawText: string) => {
    const text = rawText.trim();
    if (!text || postSalesQueryMutation.isPending) return;

    setMessages((current) => [...current, { id: productionChatMessageId++, role: "user", text }]);
    setInput("");

    try {
      const response = await postSalesQueryMutation.mutateAsync(text);
      setMessages((current) => [
        ...current,
        {
          id: productionChatMessageId++,
          role: "assistant",
          text: response.text || "답변을 생성하지 못했어요. 잠시 후 다시 시도해 주세요.",
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: productionChatMessageId++,
          role: "assistant",
          text: "답변 생성 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.",
        },
      ]);
    }
  };

  return (
    <section className="overflow-hidden rounded-[28px] border border-[#dbe6fb] bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="border-b border-[#e6edf9] px-6 py-5">
        <p className="text-sm font-bold text-slate-900">생산 관련 빠른 질문</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestedQuestions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                void sendMessage(item);
              }}
              disabled={postSalesQueryMutation.isPending}
              className="rounded-full border border-[#dce4f3] bg-[#f7faff] px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-[#eef4ff] hover:text-[#2454C8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[340px] min-h-[220px] space-y-4 overflow-y-auto px-6 py-5">
        {messages.length === 0 ? (
          <p className="text-sm text-slate-400">질문을 선택하거나 아래에 직접 입력해 주세요.</p>
        ) : null}
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[88%] rounded-[18px] px-4 py-3 text-sm leading-6 ${
                message.role === "user"
                  ? "rounded-br-sm bg-[#2454C8] text-white"
                  : "rounded-bl-sm border border-[#dce4f3] bg-[#f8fbff] text-slate-700"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {postSalesQueryMutation.isPending ? (
          <div className="flex justify-start">
            <div className="rounded-[18px] rounded-bl-sm border border-[#dce4f3] bg-[#f8fbff] px-4 py-3 text-sm text-slate-500">
              응답 생성 중...
            </div>
          </div>
        ) : null}
      </div>

      <div className="border-t border-[#e6edf9] px-6 py-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void sendMessage(input);
              }
            }}
            placeholder="예: 오늘 집중 생산해야 할 SKU는?"
            className="flex-1 rounded-2xl border border-[#dce4f3] bg-[#f8fbff] px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#2454C8]"
          />
          <button
            type="button"
            onClick={() => {
              void sendMessage(input);
            }}
            disabled={postSalesQueryMutation.isPending}
            className="inline-flex items-center justify-center rounded-2xl bg-[#2454C8] px-4 py-3 text-white transition-colors hover:bg-[#1d44a8] disabled:cursor-not-allowed disabled:bg-slate-300"
            aria-label="질문 전송"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
