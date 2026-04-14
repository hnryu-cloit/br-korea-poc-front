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
          <Link
            key={action.id}
            to={action.cta_path}
            className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${urgencyStyleMap[action.urgency]}`}>
                  {action.badge_label}
                </div>
                <p className="mt-3 text-lg font-bold text-slate-900">{action.title}</p>
                <p className="mt-1 text-sm text-slate-500">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
