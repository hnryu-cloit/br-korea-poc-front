import { Calendar, Send, Store, TrendingUp } from "lucide-react";

import type { SalesQueryHistoryItem } from "@/features/sales/types/sales-screen";

export function SalesQueryTab({
  query,
  onChangeQuery,
  onSubmit,
  isSubmitting = false,
  suggestedQuestions,
  responses,
  storeName,
}: {
  query: string;
  onChangeQuery: (value: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  suggestedQuestions: string[];
  responses: SalesQueryHistoryItem[];
  storeName: string;
}) {
  return (
    <div className="space-y-5">
      <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-sm">
        <p className="text-lg font-bold text-slate-900">AI 손익 분석</p>
        <p className="mt-1 text-sm text-slate-500">자연어 질의로 {storeName} 맞춤형 인사이트를 제공합니다.</p>
        <div className="mt-4 flex gap-2">
          <input
            value={query}
            onChange={(event) => onChangeQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") onSubmit();
            }}
            placeholder="예: 오늘 순이익은 얼마인가요?"
            className="flex-1 rounded-2xl border border-[#dce4f3] bg-[#f8fbff] px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#2454C8]"
          />
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-2xl bg-[#2454C8] px-4 py-3 text-white transition-colors hover:bg-[#1d44a8] disabled:opacity-60"
            aria-label="질문 전송"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4">
          <p className="text-sm font-bold text-slate-700">추천 질문 (10개 이상)</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestedQuestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onChangeQuery(item)}
                className="rounded-full border border-[#dce4f3] bg-[#f7faff] px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-[#eef4ff] hover:text-[#2454C8]"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </article>

      {responses.map((response) => (
        <article key={`${response.query}-${response.calculationDate}`} className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#2454C8] px-3 py-1 text-xs font-bold text-white">질문</span>
            <p className="font-semibold text-slate-900">{response.query}</p>
          </div>

          <div className="mt-4 rounded-2xl border border-[rgba(109,77,180,0.18)] bg-[rgba(250,246,255,0.92)] px-4 py-4">
            <div className="flex items-center gap-2 text-[#6d4db4]">
              <Store className="h-4 w-4" />
              <p className="text-xs font-bold">{response.storeContext}</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-700">{response.answer}</p>
          </div>

          <div className="mt-4">
            <p className="text-sm font-bold text-slate-700">실행 가능한 인사이트</p>
            <div className="mt-3 space-y-2">
              {response.insights.map((insight) => (
                <div key={insight} className="flex items-start gap-3 rounded-2xl bg-[#edf4ff] px-4 py-3 text-sm text-slate-700">
                  <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-[#2454C8]" />
                  {insight}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 border-t border-border/60 pt-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              계산 기준일: {response.calculationDate}
            </div>
            <p className="mt-1">데이터 출처: {response.dataSource}</p>
            <p className="mt-1">비교 기준: {response.comparisonBasis}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
