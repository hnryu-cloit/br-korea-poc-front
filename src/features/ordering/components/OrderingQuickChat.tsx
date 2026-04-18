import { Send } from "lucide-react";
import { useState } from "react";

import type { DashboardCardChatHistoryItem } from "@/commons/utils/dashboard-card-chat-history";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";
import { usePostSalesQueryMutation } from "@/features/sales/queries/usePostSalesQueryMutation";

interface OrderingQuickChatMessage {
  id: number;
  role: "user" | "assistant";
  text: string;
  evidence?: string[];
  actions?: string[];
}

let orderingChatMessageId = 1;

export function OrderingQuickChat({
  prompts,
  initialHistory = [],
  initialInput = "",
}: {
  prompts: string[];
  initialHistory?: DashboardCardChatHistoryItem[];
  initialInput?: string;
}) {
  const { user } = useDemoSession();
  const [messages, setMessages] = useState<OrderingQuickChatMessage[]>(() =>
    initialHistory.flatMap((item) => [
      { id: orderingChatMessageId++, role: "user" as const, text: item.question },
      {
        id: orderingChatMessageId++,
        role: "assistant" as const,
        text: item.answer,
        evidence: item.evidence,
        actions: item.actions,
      },
    ]),
  );
  const [input, setInput] = useState(initialInput);
  const postSalesQueryMutation = usePostSalesQueryMutation(user.storeId, "ordering");

  const sendMessage = async (rawText: string) => {
    const text = rawText.trim();
    if (!text || postSalesQueryMutation.isPending) return;

    setMessages((current) => [...current, { id: orderingChatMessageId++, role: "user", text }]);
    setInput("");

    try {
      const response = await postSalesQueryMutation.mutateAsync(text);
      setMessages((current) => [
        ...current,
        {
          id: orderingChatMessageId++,
          role: "assistant",
          text: response.text || "답변을 생성하지 못했어요. 잠시 후 다시 시도해 주세요.",
          evidence: response.evidence ?? [],
          actions: response.actions ?? [],
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: orderingChatMessageId++,
          role: "assistant",
          text: "답변 생성 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.",
          evidence: [],
          actions: [],
        },
      ]);
    }
  };

  return (
    <section className="overflow-hidden rounded-[28px] border border-[#dbe6fb] bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="border-b border-[#e6edf9] px-6 py-5">
        <p className="text-sm font-bold text-slate-900">주문 관련 빠른 질문</p>
      </div>

      <div className="max-h-[340px] min-h-[220px] space-y-4 overflow-y-auto px-6 py-5">
        {messages.length === 0 ? (
          <p className="text-sm text-slate-400">질문을 선택하거나 아래에 직접 입력해 주세요.</p>
        ) : null}
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[88%] space-y-2">
              <div
                className={`rounded-[18px] px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "rounded-br-sm bg-[#2454C8] text-white"
                    : "rounded-bl-sm border border-[#dce4f3] bg-[#f8fbff] text-slate-700"
                }`}
              >
                {message.text}
              </div>
              {message.role === "assistant" && message.evidence?.length ? (
                <div className="rounded-xl bg-white px-3 py-2 text-xs text-slate-500 shadow-sm">
                  <p className="mb-1 font-semibold text-slate-700">근거</p>
                  <ul className="list-disc space-y-1 pl-4">
                    {message.evidence.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {message.role === "assistant" && message.actions?.length ? (
                <div className="flex flex-wrap gap-2">
                  {message.actions.map((action) => (
                    <span key={action} className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold text-[#2454C8]">
                      {action}
                    </span>
                  ))}
                </div>
              ) : null}
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
        <div className="mb-3 flex flex-wrap gap-2">
          {prompts.map((item) => (
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
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void sendMessage(input);
              }
            }}
            placeholder="예: 오늘 추천 주문량 근거를 알려줘"
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
