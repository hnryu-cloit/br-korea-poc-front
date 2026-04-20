import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

import type { DashboardPriorityAction } from "@/features/dashboard/types/dashboard";

const urgencyBadgeClassMap: Record<DashboardPriorityAction["urgency"], string> = {
  urgent: "bg-red-100 text-red-700",
  important: "bg-orange-100 text-orange-700",
  recommended: "bg-blue-100 text-blue-700",
};

const urgencyCardClassMap: Record<DashboardPriorityAction["urgency"], string> = {
  urgent: "border-red-200 bg-red-50/50",
  important: "border-orange-200 bg-orange-50/50",
  recommended: "border-[#dbe6fb] bg-[#f7faff]",
};

export function PriorityActionsSection({ actions }: { actions: DashboardPriorityAction[] }) {
  return (
    <section className="rounded-[28px] border border-orange-200 bg-[linear-gradient(135deg,#fff8ef_0%,#ffffff_100%)] px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-bold text-slate-900">지금 해야 할 일</p>
          <p className="mt-1 text-sm text-slate-500">
            즉시 액션이 필요한 항목 3개를 우선순위대로 보여줍니다.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        {actions.map((action) => (
          <article
            key={action.id}
            className={cn(
              "rounded-[24px] border px-5 py-5 shadow-sm",
              action.is_finished_good
                ? "border-slate-200 bg-[#f8fafc]"
                : urgencyCardClassMap[action.urgency],
            )}
          >
            <div>
              <div
                className={cn(
                  "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold",
                  action.is_finished_good
                    ? "bg-slate-200 text-slate-600"
                    : urgencyBadgeClassMap[action.urgency],
                )}
              >
                {action.badge_label}
              </div>
              <p className="mt-3 text-lg font-bold text-slate-900">{action.title}</p>
              <p className="mt-1 text-sm text-slate-600">{action.description}</p>
              {action.ai_reasoning ? (
                <p className="mt-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs leading-relaxed text-slate-700">
                  {action.ai_reasoning}
                </p>
              ) : null}
              {typeof action.confidence_score === "number" ? (
                <p className="mt-3 text-xs font-semibold text-slate-700">
                  AI 신뢰도 {Math.round(Math.max(0, Math.min(1, action.confidence_score)) * 100)}%
                </p>
              ) : null}
            </div>
            <div className="mt-4">
              {action.is_finished_good ? (
                <Link
                  to={action.cta.path}
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  {action.cta.label}
                </Link>
              ) : action.urgency === "recommended" ? (
                <Link
                  to={action.cta.path}
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-[#cfe0ff] bg-white px-3 text-xs font-semibold text-[#2454C8] transition-colors hover:bg-[#f5f9ff]"
                >
                  {action.cta.label}
                </Link>
              ) : (
                <Link
                  to={action.cta.path}
                  className={cn(
                    "inline-flex h-9 items-center justify-center rounded-xl px-3 text-xs font-semibold text-white transition-colors",
                    action.urgency === "urgent"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-[#2454C8] hover:bg-[#1d44a8]",
                  )}
                >
                  {action.cta.label}
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
