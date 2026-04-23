import type { OrderingHistoryInsightsResponse } from "@/features/ordering/types/ordering";

type Props = {
  data: OrderingHistoryInsightsResponse | undefined;
  isLoading: boolean;
};

const KPI_TONE_CLASS: Record<string, string> = {
  primary: "bg-blue-50 text-blue-800 border-blue-100",
  warning: "bg-amber-50 text-amber-800 border-amber-100",
  danger: "bg-red-50 text-red-800 border-red-100",
  success: "bg-emerald-50 text-emerald-800 border-emerald-100",
  default: "bg-slate-50 text-slate-800 border-slate-200",
};

const SEVERITY_STYLE: Record<string, string> = {
  high: "bg-red-50 text-red-700 border border-red-200",
  medium: "bg-amber-50 text-amber-700 border border-amber-200",
  low: "bg-blue-50 text-blue-700 border border-blue-200",
};

const SEVERITY_LABEL: Record<string, string> = {
  high: "높음",
  medium: "중간",
  low: "낮음",
};

export function OrderingHistoryInsightsSection({ data, isLoading }: Props) {
  return (
    <section className="rounded-[24px] border border-border bg-white px-6 py-6 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">이상징후 분석</h2>
        <span className="text-xs text-slate-500">자동 탐지</span>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {(data?.kpis ?? []).map((kpi) => {
          const cls = KPI_TONE_CLASS[kpi.tone] ?? KPI_TONE_CLASS.default;
          return (
            <article key={kpi.key} className={`rounded-2xl border px-4 py-3 ${cls}`}>
              <p className="text-xs font-semibold opacity-70">{kpi.label}</p>
              <p className="mt-1 text-xl font-bold">{kpi.value}</p>
            </article>
          );
        })}
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
          <p className="text-sm font-bold text-slate-800">이상징후</p>
          {isLoading ? (
            <p className="mt-2 text-sm text-slate-400">불러오는 중...</p>
          ) : (data?.anomalies ?? []).length === 0 ? (
            <p className="mt-2 text-sm text-slate-400">특이 이상징후가 없습니다.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {(data?.anomalies ?? []).map((anomaly) => {
                const badgeCls = SEVERITY_STYLE[anomaly.severity] ?? SEVERITY_STYLE.low;
                return (
                  <li
                    key={anomaly.id}
                    className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3"
                  >
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeCls}`}
                    >
                      {SEVERITY_LABEL[anomaly.severity] ?? anomaly.severity}
                    </span>
                    <p className="mt-1.5 text-sm font-semibold text-slate-800">{anomaly.message}</p>
                    <p className="mt-1 text-xs text-slate-500">{anomaly.recommended_action}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
          <p className="text-sm font-bold text-slate-800">주요 변동 품목</p>
          {isLoading ? (
            <p className="mt-2 text-sm text-slate-400">불러오는 중...</p>
          ) : (data?.top_changed_items ?? []).length === 0 ? (
            <p className="mt-2 text-sm text-slate-400">변동 품목이 없습니다.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {(data?.top_changed_items ?? []).map((item) => {
                const pct = Math.round(item.change_ratio * 100);
                const isUp = pct >= 0;
                return (
                  <li
                    key={item.item_nm}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.item_nm}</p>
                      <p className="text-xs text-slate-500">
                        평균 {item.avg_ord_qty.toFixed(1)}개 → 최근 {item.latest_ord_qty}개
                      </p>
                    </div>
                    <p
                      className={`flex items-center gap-0.5 text-sm font-bold ${isUp ? "text-rose-600" : "text-blue-600"}`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {isUp ? "arrow_upward" : "arrow_downward"}
                      </span>
                      {isUp ? "+" : ""}
                      {pct}%
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </article>
      </div>
    </section>
  );
}
