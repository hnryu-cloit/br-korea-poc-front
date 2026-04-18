import { ShieldAlert, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { appendDashboardCardChatHistory } from "@/commons/utils/dashboard-card-chat-history";
import {
  formatDashboardValueWithUnit,
  parseDashboardHighlight,
} from "@/commons/utils/dashboard-formatters";
import { usePostSalesQueryMutation } from "@/features/sales/queries/usePostSalesQueryMutation";
import type { DashboardSummaryCard } from "@/features/dashboard/types/dashboard";
import type { SalesQueryResponse } from "@/features/sales/types/sales";

const domainAccentClassMap: Record<DashboardSummaryCard["domain"], string> = {
  production: "bg-[#eef4ff] text-[#2454C8] border-[#cdddfc]",
  ordering: "bg-[#eefaf4] text-[#0f766e] border-[#cfeee3]",
  sales: "bg-[#fff6ee] text-[#c2410c] border-[#fedec3]",
};

const metricToneClassMap: Record<NonNullable<NonNullable<DashboardSummaryCard["metrics"]>[number]["tone"]>, string> = {
  default: "text-slate-800",
  primary: "text-[#2454C8]",
  success: "text-[#15803d]",
  danger: "text-red-600",
};

export function SummaryCardBody({ card }: { card: DashboardSummaryCard }) {
  const [latestResponse, setLatestResponse] = useState<SalesQueryResponse | null>(null);
  const [lastQuestion, setLastQuestion] = useState<string>("");
  const [lastHistoryId, setLastHistoryId] = useState<string>("");
  const postSalesQueryMutation = usePostSalesQueryMutation(undefined, card.domain);

  const parsedHighlights = useMemo(
    () => card.highlights_text.map(parseDashboardHighlight),
    [card.highlights_text],
  );

  const runPrompt = async (prompt: string) => {
    if (!prompt.trim() || postSalesQueryMutation.isPending) return;
    const question = prompt.trim();
    setLastQuestion(question);
    try {
      const response = await postSalesQueryMutation.mutateAsync(question);
      const nextResponse: SalesQueryResponse = {
        ...response,
        text: response.text || "답변을 생성하지 못했어요. 잠시 후 다시 시도해 주세요.",
      };
      setLatestResponse(nextResponse);
      const saved = appendDashboardCardChatHistory(card.domain, question, nextResponse.text, {
        evidence: nextResponse.evidence,
        actions: nextResponse.actions,
      });
      setLastHistoryId(saved?.id ?? "");
    } catch {
      const nextResponse: SalesQueryResponse = {
        text: "답변 생성 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.",
        actions: [],
        store_context: "",
        data_source: "",
        comparison_basis: "",
        calculation_date: "",
        blocked: false,
        evidence: [],
      };
      setLatestResponse(nextResponse);
      const saved = appendDashboardCardChatHistory(card.domain, question, nextResponse.text, {
        evidence: [],
        actions: [],
      });
      setLastHistoryId(saved?.id ?? "");
    }
  };

  return (
    <>
      <section>
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <Sparkles className="h-3.5 w-3.5 text-[#2454C8]" />
          AI 질문
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {card.prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => {
                void runPrompt(prompt);
              }}
              disabled={postSalesQueryMutation.isPending}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${domainAccentClassMap[card.domain]} hover:brightness-95`}
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="mt-3">
          <p className="mb-1 text-xs font-semibold text-slate-500">AI 응답</p>
          <div className="space-y-3 rounded-xl border border-[#dce4f3] bg-[#f8fbff] px-4 py-3">
            {postSalesQueryMutation.isPending ? (
              <p className="text-sm leading-6 text-slate-500">응답 생성 중...</p>
            ) : !latestResponse ? (
              <p className="text-sm leading-6 text-slate-700">질문을 선택하면 이 영역에 답변을 표시합니다.</p>
            ) : (
              <>
                <p className={`text-sm leading-6 ${latestResponse.blocked ? "text-red-700" : "text-slate-700"}`}>
                  {latestResponse.text}
                </p>

                {latestResponse.blocked ? (
                  <div className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-600">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    민감정보 정책 적용
                  </div>
                ) : null}

                {latestResponse.evidence?.length ? (
                  <div className="rounded-xl bg-white px-3 py-2 text-xs text-slate-500">
                    <p className="mb-1 font-semibold text-slate-700">근거</p>
                    <ul className="list-disc space-y-1 pl-4">
                      {latestResponse.evidence.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {latestResponse.actions?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {latestResponse.actions.map((action) => (
                      <span key={action} className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold text-[#2454C8]">
                        {action}
                      </span>
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
        <div className="mt-3">
          <Link
            to={card.cta.path}
            state={{
              source: "dashboard-card-chat",
              domain: card.domain,
              intent: "ask",
              prompt: lastQuestion || undefined,
              chatHistoryId: lastHistoryId || undefined,
            }}
            className="inline-flex items-center justify-center text-xs font-semibold text-[#2454C8] underline underline-offset-2 transition-colors hover:text-[#1d44a8]"
          >
            더 자세히 질문하기
          </Link>
        </div>
      </section>
      <div className="h-px bg-[#e6edf9]" />

      <section>
        <ul className="list-disc space-y-2 pl-5">
          {parsedHighlights.map((highlight) => (
            <li key={`${highlight.title}-${highlight.detail ?? ""}`} className="text-sm text-slate-700 marker:text-slate-400">
              <p className="font-semibold text-slate-800">{highlight.title}</p>
              {highlight.detail ? (
                <p className="mt-1 text-xs leading-5 text-slate-500">{highlight.detail}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
      <div className="h-px bg-[#e6edf9]" />

      <section>
        <div className="grid grid-cols-2 gap-2">
          {card.metrics.map((metric) => (
            <div key={metric.key} className="rounded-lg border border-[#edf2f7] bg-[#fbfcfe] px-3 py-2">
              <p className="text-[11px] font-medium text-slate-400">{metric.label}</p>
              <p className={`mt-1 text-base font-semibold ${metricToneClassMap[metric.tone ?? "default"]}`}>
                {formatDashboardValueWithUnit(metric.value, metric.unit)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
