import { TrendingUp, TrendingDown, Minus, Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { PageHero } from "@/commons/components/page/page-layout";
import { formatCountWithUnit } from "@/commons/utils/format-count";
import { getSignals } from "@/features/admin/signals/api/signals";
import type { SalesSignal } from "@/features/admin/signals/types/signals";

const trendIcon = (trend: SalesSignal["trend"]) => {
  if (trend === "up") return <TrendingUp className="h-4 w-4" />;
  if (trend === "down") return <TrendingDown className="h-4 w-4" />;
  return <Minus className="h-4 w-4" />;
};

const priorityConfig = {
  high: { label: "긴급", className: "bg-red-50 text-red-600 border border-red-100" },
  medium: { label: "주의", className: "bg-orange-50 text-orange-600 border border-orange-100" },
  low: { label: "참고", className: "bg-slate-100 text-slate-500" },
};

const trendConfig = {
  up: { bg: "bg-green-50", text: "text-green-600" },
  down: { bg: "bg-red-50", text: "text-red-600" },
  flat: { bg: "bg-slate-50", text: "text-slate-500" },
};

export function SignalsPage() {
  const signalsQuery = useQuery({
    queryKey: ["signals"],
    queryFn: getSignals,
    refetchInterval: 30_000,
  });

  const signals = signalsQuery.data?.items ?? [];
  const highCount = signalsQuery.data?.high_count ?? 0;

  return (
    <div className="space-y-6">
      <PageHero
        title="전국 매장 매출 이상 신호를 확인합니다."
        description="긴급 대응이 필요한 시그널을 우선순위별로 정리해 보여줍니다."
      >
        {highCount > 0 ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
            <Bell className="h-4 w-4" />
            긴급 시그널 {formatCountWithUnit(highCount, "건")} · 즉시 검토 필요
          </div>
        ) : null}
      </PageHero>

      {/* Signal cards */}
      {signalsQuery.isLoading ? (
        <p className="text-sm text-slate-400 text-center py-10">불러오는 중...</p>
      ) : (
        <section className="grid gap-5 xl:grid-cols-2">
          {signals.map((signal) => {
            const pc = priorityConfig[signal.priority];
            const tc = trendConfig[signal.trend];
            return (
              <article key={signal.id} className={`rounded-[28px] border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)] ${
                signal.priority === "high" ? "border-red-200" : "border-border"
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tc.bg}`}>
                      <span className={tc.text}>{trendIcon(signal.trend)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-base font-semibold text-slate-900">{signal.title}</p>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${pc.className}`}>{pc.label}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{signal.region}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold text-slate-900">{signal.value}</p>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${tc.bg} ${tc.text}`}>
                      {trendIcon(signal.trend)}
                      {signal.change}
                    </span>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-[#f8fbff] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 mb-1">AI 인사이트</p>
                  <p className="text-sm leading-6 text-slate-600">{signal.insight}</p>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-400">{signal.metric}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-200" />
                  <span className="text-xs font-medium text-slate-400">실시간</span>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
