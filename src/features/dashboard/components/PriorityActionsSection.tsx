import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

import {
  urgencyStyleMap
} from "@/features/dashboard/components/dashboard-style";
import type { DashboardPriorityAction } from "@/features/dashboard/types/dashboard";

export function PriorityActionsSection({ actions }: { actions: DashboardPriorityAction[] }) {
  return (
    <section className="rounded-[28px] border border-orange-200 bg-[linear-gradient(135deg,#fff8ef_0%,#ffffff_100%)] px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-bold text-slate-900">지금 해야 할 일</p>
          <p className="mt-1 text-sm text-slate-500">즉시 액션이 필요한 항목 3개를 우선순위대로 보여줍니다.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        {actions.map((action) => (
          <article
            key={action.id}
            className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${urgencyStyleMap[action.urgency]}`}>
                  {action.badge_label}
                </div>
                  <div className="mt-2 inline-flex rounded-full border border-[#dbe6fb] bg-[#f4f8ff] px-2.5 py-1 text-[11px] font-semibold text-[#2454C8]">
                    AI 신뢰도: {Math.round(Math.max(0, Math.min(1, Number(action.confidence_score))) * 100)}%
                  </div>
                <p className="mt-3 text-lg font-bold text-slate-900">{action.title}</p>
                <p className="mt-1 text-sm text-slate-500">{action.description}</p>
                {action.ai_reasoning ? (
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{action.ai_reasoning}</p>
                ) : null}
              </div>
            </div>
            <div className="mt-4">
              {action.type === "production" && action.is_finished_good ? (
                <button
                  type="button"
                  disabled
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-3 text-xs font-semibold text-slate-400"
                >
                  본사 납품 완제품
                </button>
              ) : (
                <Link
                  to={action.cta_path}
                  className="inline-flex h-9 items-center justify-center rounded-xl bg-[#2454C8] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#1d44a8]"
                >
                  {action.cta_label}
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
