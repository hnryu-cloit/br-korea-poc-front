import { BarChart3, Send, ShieldAlert } from "lucide-react";
import type { RefObject } from "react";

import { SectionHint } from "@/features/sales/components/SectionHint";
import {
  SalesV2QueryDataChart,
  hasSalesV2ChartData,
} from "@/features/sales/components/SalesV2QueryDataChart";
import {
  SALES_V2_HINT_QUESTIONS,
  SALES_V2_QUERY_TYPE_LABEL,
  SALES_V2_QUERY_TYPE_STYLE,
  SALES_V2_ROUTE_LABEL,
  SALES_V2_ROUTE_STYLE,
} from "@/features/sales/constants/sales-v2";
import type { SalesV2Message } from "@/features/sales/types/sales-v2";

export const SalesV2ChatPanel = ({
  messages,
  prompts,
  promptsLoading,
  input,
  loading,
  bottomRef,
  onChangeInput,
  onSelectPrompt,
  onSubmitInput,
}: {
  messages: SalesV2Message[];
  prompts: { label: string; prompt: string }[];
  promptsLoading: boolean;
  input: string;
  loading: boolean;
  bottomRef: RefObject<HTMLDivElement>;
  onChangeInput: (value: string) => void;
  onSelectPrompt: (prompt: string) => void;
  onSubmitInput: () => void;
}) => {
  const latestAssistantMessage = [...messages]
    .reverse()
    .find((message) => message.role === "assistant");

  return (
    <div className="flex min-h-[520px] flex-col overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-6 py-4">
        <div>
          <p className="text-sm font-bold text-slate-800">매출 분석</p>
          <p className="mt-0.5 text-xs text-slate-400">
            {latestAssistantMessage
              ? `최근 응답 경로는 ${SALES_V2_ROUTE_LABEL[latestAssistantMessage.processingRoute ?? ""] ?? "분석"} 기준입니다`
              : "아래에 궁금한 내용을 입력하거나 오른쪽 버튼을 눌러보세요"}
          </p>
        </div>
        <SectionHint questions={SALES_V2_HINT_QUESTIONS} />
      </div>

      <div className="max-h-[420px] flex-1 space-y-5 overflow-y-auto px-5 py-5">
        {messages.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <BarChart3 className="mb-3 h-10 w-10 text-slate-200" />
            <p className="text-sm font-medium text-slate-400">오른쪽에서 질문을 선택하거나</p>
            <p className="text-sm text-slate-400">아래에 직접 입력해 보세요</p>
          </div>
        ) : null}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "user" ? (
              <div className="max-w-[80%] rounded-[20px] rounded-br-sm bg-[#2454C8] px-4 py-3 text-sm text-white">
                {msg.text}
              </div>
            ) : (
              <div className="max-w-[90%] space-y-3">
                <div
                  className={`rounded-[20px] rounded-bl-sm border px-5 py-4 ${msg.blocked ? "border-red-200 bg-red-50" : "border-border bg-[#f8fbff]"}`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {msg.processingRoute ? (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${SALES_V2_ROUTE_STYLE[msg.processingRoute] ?? "bg-slate-100 text-slate-600"}`}
                      >
                        {SALES_V2_ROUTE_LABEL[msg.processingRoute] ?? msg.processingRoute}
                      </span>
                    ) : null}
                    {msg.queryType ? (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${SALES_V2_QUERY_TYPE_STYLE[msg.queryType] ?? "bg-slate-100 text-slate-600"}`}
                      >
                        {SALES_V2_QUERY_TYPE_LABEL[msg.queryType] ?? msg.queryType}
                      </span>
                    ) : null}
                  </div>

                  <p
                    className={`mt-2 text-sm leading-6 ${msg.blocked ? "text-red-700" : "text-slate-700"}`}
                  >
                    {msg.text}
                  </p>

                  {msg.blocked ? (
                    <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-600">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      민감정보 정책 적용
                    </div>
                  ) : null}
                </div>

                {!hasSalesV2ChartData({
                  comparison: msg.comparison,
                  visualData: msg.visualData,
                  evidence: msg.evidence,
                }) && msg.evidence?.length ? (
                  <div className="rounded-2xl bg-white px-4 py-3 text-xs text-slate-500 shadow-sm">
                    <p className="mb-1 font-semibold text-slate-700">근거</p>
                    <ul className="list-disc space-y-1 pl-4">
                      {msg.evidence.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <SalesV2QueryDataChart
                  comparison={msg.comparison}
                  visualData={msg.visualData}
                  evidence={msg.evidence}
                />

                {msg.actions?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {msg.actions.map((action) => (
                      <span
                        key={action}
                        className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold text-[#2454C8]"
                      >
                        {action}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        ))}
        {loading ? (
          <div className="flex justify-start">
            <div className="max-w-[90%] rounded-[20px] rounded-bl-sm border border-border bg-[#f8fbff] px-5 py-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1 text-[#2454C8]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2454C8]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2454C8] [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2454C8] [animation-delay:300ms]" />
                </span>
                응답 생성 중...
              </div>
            </div>
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border/60 px-5 py-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {prompts.map((item) => (
            <button
              key={item.prompt}
              type="button"
              onClick={() => onSelectPrompt(item.prompt)}
              disabled={loading}
              className="rounded-full border border-[#dce4f3] bg-[#f7faff] px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-[#eef4ff] hover:text-[#2454C8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {item.label}
            </button>
          ))}
          {promptsLoading ? (
            <p className="px-1 py-2 text-xs text-slate-400">추천 질문 불러오는 중...</p>
          ) : null}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(event) => onChangeInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") onSubmitInput();
            }}
            placeholder="예: 이번 주 배달 매출이 감소한 이유는?"
            className="flex-1 rounded-2xl border border-[#dce4f3] bg-[#f8fbff] px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#2454C8]"
          />
          <button
            type="button"
            onClick={onSubmitInput}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-2xl bg-[#2454C8] px-4 py-3 text-white transition-colors hover:bg-[#1d44a8] disabled:cursor-not-allowed disabled:bg-slate-300"
            aria-label="질문 전송"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
