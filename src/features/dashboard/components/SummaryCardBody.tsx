import { useState } from "react";

import { usePostSalesQueryMutation } from "@/features/sales/queries/usePostSalesQueryMutation";
import type { DashboardSummaryCard } from "@/features/dashboard/types/dashboard";

export function SummaryCardBody({ card }: { card: DashboardSummaryCard }) {
  const [answer, setAnswer] = useState<string>("");
  const [expandedHighlights, setExpandedHighlights] = useState(false);
  const [expandedMetrics, setExpandedMetrics] = useState(false);
  const postSalesQueryMutation = usePostSalesQueryMutation();

  const visibleHighlights = expandedHighlights ? card.highlights : card.highlights.slice(0, 2);
  const visibleMetrics = expandedMetrics ? card.metrics : card.metrics.slice(0, 2);

  const runPrompt = async (prompt: string) => {
    if (!prompt.trim() || postSalesQueryMutation.isPending) return;
    try {
      const response = await postSalesQueryMutation.mutateAsync(prompt);
      setAnswer(response.text || "답변을 생성하지 못했어요. 잠시 후 다시 시도해 주세요.");
    } catch {
      setAnswer("답변 생성 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <>
      <section>
        <div className="mt-3 flex flex-wrap gap-2">
          {card.prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => {
                void runPrompt(prompt);
              }}
              disabled={postSalesQueryMutation.isPending}
              className="rounded-full border border-[#dce4f3] bg-[#f7faff] px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-[#eef4ff] hover:text-[#2454C8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="mt-3 rounded-2xl border border-[#dce4f3] bg-[#f8fbff] px-4 py-3 text-sm leading-6 text-slate-700">
          {postSalesQueryMutation.isPending
            ? "응답 생성 중..."
            : answer || "질문을 선택하면 이 영역에 답변을 표시합니다."}
        </div>
      </section>
      <div className="h-px bg-[#e6edf9]" />

      <section>
        <div className="space-y-2">
          {visibleHighlights.map((highlight) => (
            <div key={highlight} className="rounded-2xl border border-[#e6edf9] px-4 py-3">
              <p className="text-sm font-bold text-slate-800">{highlight}</p>
            </div>
          ))}
        </div>
        {card.highlights.length > 2 ? (
          <button
            type="button"
            onClick={() => setExpandedHighlights((prev) => !prev)}
            className="mt-2 text-xs font-semibold text-[#2454C8] hover:text-[#1d44a8]"
          >
            {expandedHighlights ? "접기" : "더보기"}
          </button>
        ) : null}
      </section>
      <div className="h-px bg-[#e6edf9]" />

      <section>
        <div className="space-y-3 rounded-2xl bg-[#f8fbff] px-4 py-4">
          {visibleMetrics.map((metric) => (
            <div key={metric.label} className="flex items-center justify-between gap-2 text-sm">
              <span className="text-slate-500">{metric.label}</span>
              <span className={metric.tone === "danger" ? "font-bold text-red-600" : "font-bold text-slate-800"}>{metric.value}</span>
            </div>
          ))}
        </div>
        {card.metrics.length > 2 ? (
          <button
            type="button"
            onClick={() => setExpandedMetrics((prev) => !prev)}
            className="mt-2 text-xs font-semibold text-[#2454C8] hover:text-[#1d44a8]"
          >
            {expandedMetrics ? "접기" : "더보기"}
          </button>
        ) : null}
      </section>
    </>
  );
}
