import type { OrderingHistoryInsightsResponse } from "@/features/ordering/types/ordering";
import arrow_red from "@/assets/arrow_red.svg";
import arrow_blue from "@/assets/arrow_blue.svg";

type Props = {
  data: OrderingHistoryInsightsResponse | undefined;
  isLoading: boolean;
};

const SEVERITY_STYLE: Record<string, string> = {
  high: "border-[#FB2C36] text-[#FB2C36]",
  medium: "border-[#00BBA7] text-[#00BBA7]",
  low: "border-[#FF671F] text-[#FF671F]",
};

const SEVERITY_LABEL: Record<string, string> = {
  high: "높음",
  medium: "중간",
  low: "낮음",
};

export function OrderingHistoryInsightsSection({ data }: Props) {
  return (
    <section className="rounded-[6px] border border-[#DADADA] bg-white p-2 flex flex-col gap-2">
      <h2 className="text-sm font-bold text-black">이상징후 분석</h2>
      {/* <div className="border border-[#DADADA] px-2 h-20 rounded-[6px]">
        {(data?.kpis ?? []).map((kpi) => {
          const cls = KPI_TONE_CLASS[kpi.tone] ?? KPI_TONE_CLASS.default;
          return (
            <article key={kpi.key} className={`rounded-2xl border px-4 py-3 ${cls}`}>
              <p className="text-xs font-semibold opacity-70">{kpi.label}</p>
              <p className="mt-1 text-xl font-bold">{kpi.value}</p>
            </article>
          );
        })}
      </div> */}
      <div className="grid gap-2 lg:grid-cols-2">
        <article className="rounded-[8px] border border-[#DADADA] bg-white p-6">
          <p className="text-2xl font-bold text-brown-700">이상징후</p>
          <div className="h-[1px] bg-[#D9D9D9] mt-4 mb-6" />
          <ul className="flex flex-col gap-2">
            {(data?.anomalies ?? []).map((anomaly) => {
              const badgeCls = SEVERITY_STYLE[anomaly.severity] ?? SEVERITY_STYLE.low;
              return (
                <li
                  key={anomaly.id}
                  className="rounded-[8px] border border-[#DADADA] bg-white p-4 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-md font-bold text-[#2E2520]">{anomaly.message}</p>
                    <span
                      className={`inline-block rounded-[24px] px-2 py-1 text-sm font-bold border ${badgeCls}`}
                    >
                      {SEVERITY_LABEL[anomaly.severity] ?? anomaly.severity}
                    </span>
                  </div>
                  <p className="text-sm text-[#653819]">{anomaly.recommended_action}</p>
                </li>
              );
            })}
          </ul>
        </article>
        <article className="rounded-[8px] border border-[#DADADA] bg-white p-6">
          <p className="text-2xl font-bold text-brown-700">주요 변동 품목</p>
          <div className="h-[1px] bg-[#D9D9D9] mt-4 mb-6" />{" "}
          <ul className="flex flex-col gap-2">
            {(data?.top_changed_items ?? []).map((item) => {
              const pct = Math.round(item.change_ratio * 100);
              const isUp = pct >= 0;
              return (
                <li
                  key={item.item_nm}
                  className="rounded-[8px] border border-[#DADADA] bg-white p-4 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-md font-bold text-[#2E2520]">{item.item_nm}</p>
                    <div className="flex items-center gap-2">
                      <img
                        src={isUp ? arrow_red : arrow_blue}
                        className={`${isUp ? "rotate-180" : "rotate-0"}`}
                      />
                      <span className="text-brown-700 font-bold text-md">{pct}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#653819] text-right">
                    평균 {item.avg_ord_qty.toFixed(1)}개 → 최근 {item.latest_ord_qty}개
                  </p>
                </li>
              );
            })}
          </ul>
        </article>
      </div>
    </section>
  );
}
