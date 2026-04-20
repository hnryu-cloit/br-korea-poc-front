import { useMemo, useState } from "react";

import { StatsGrid } from "@/commons/components/page/page-layout";
import { PageTitle } from "@/commons/components/page/PageTitle";
import type { HighlightStat } from "@/commons/constants/page-content";
import { formatCountWithUnit } from "@/commons/utils/format-count";
import { OrderingHero } from "@/features/ordering/components/OrderingHero";
import { OrderingHistoryChartsSection } from "@/features/ordering/components/OrderingHistoryChartsSection";
import { OrderingHistorySection } from "@/features/ordering/components/OrderingHistorySection";
import { useGetOrderingHistoryQuery } from "@/features/ordering/queries/useGetOrderingHistoryQuery";
import { useGetOrderingHistoryInsightsQuery } from "@/features/ordering/queries/useGetOrderingHistoryInsightsQuery";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";

export function OrderingHistoryScreen() {
  const { user } = useDemoSession();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [itemName, setItemName] = useState("");
  const [orderType, setOrderType] = useState<"all" | "auto" | "manual">("all");

  const historyParams = useMemo(
    () => ({
      store_id: user.storeId,
      limit: 100,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
      item_nm: itemName || undefined,
      is_auto: orderType === "all" ? undefined : orderType === "auto",
    }),
    [user.storeId, dateFrom, dateTo, itemName, orderType],
  );

  const historyQuery = useGetOrderingHistoryQuery(historyParams);
  const insightsQuery = useGetOrderingHistoryInsightsQuery(historyParams);

  const orderingHistoryStats: HighlightStat[] = [
    {
      label: "총 발주 건수",
      value: historyQuery.data ? formatCountWithUnit(historyQuery.data.total_count, "건") : "-",
      tone: "primary" as const,
    },
    {
      label: "자동 발주 비중",
      value: historyQuery.data ? `${Math.round(historyQuery.data.auto_rate * 100)}%` : "-",
      tone: "success" as const,
    },
    {
      label: "수동 발주 비중",
      value: historyQuery.data ? `${Math.round(historyQuery.data.manual_rate * 100)}%` : "-",
      tone: "default" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <OrderingHero />
      <section className="rounded-[24px] border border-border bg-white px-6 py-5 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
        <div className="grid gap-3 md:grid-cols-5">
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
            시작일
            <input
              type="date"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
            종료일
            <input
              type="date"
              value={dateTo}
              onChange={(event) => setDateTo(event.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500 md:col-span-2">
            품목명
            <input
              type="text"
              value={itemName}
              onChange={(event) => setItemName(event.target.value)}
              placeholder="예: 초코, 아메리카노"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
            발주유형
            <select
              value={orderType}
              onChange={(event) => setOrderType(event.target.value as "all" | "auto" | "manual")}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
            >
              <option value="all">전체</option>
              <option value="auto">자동</option>
              <option value="manual">수동</option>
            </select>
          </label>
        </div>
      </section>
      <StatsGrid stats={orderingHistoryStats} />
      <OrderingHistoryChartsSection
        items={historyQuery.data?.items ?? []}
        topChangedItems={insightsQuery.data?.top_changed_items ?? []}
        isLoading={historyQuery.isLoading || insightsQuery.isLoading}
      />
      <section className="rounded-[24px] border border-border bg-white px-6 py-6 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">이상징후 분석</h2>
          <span className="text-xs text-slate-500">자동 탐지</span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {(insightsQuery.data?.kpis ?? []).map((kpi) => {
            const toneClass: Record<string, string> = {
              primary: "bg-blue-50 text-blue-800 border-blue-100",
              warning: "bg-amber-50 text-amber-800 border-amber-100",
              danger: "bg-red-50 text-red-800 border-red-100",
              success: "bg-emerald-50 text-emerald-800 border-emerald-100",
              default: "bg-slate-50 text-slate-800 border-slate-200",
            };
            const cls = toneClass[kpi.tone] ?? toneClass.default;
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
            {insightsQuery.isLoading ? (
              <p className="mt-2 text-sm text-slate-400">불러오는 중...</p>
            ) : (insightsQuery.data?.anomalies ?? []).length === 0 ? (
              <p className="mt-2 text-sm text-slate-400">특이 이상징후가 없습니다.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {(insightsQuery.data?.anomalies ?? []).map((anomaly) => {
                  const severityStyle: Record<string, string> = {
                    high: "bg-red-50 text-red-700 border border-red-200",
                    medium: "bg-amber-50 text-amber-700 border border-amber-200",
                    low: "bg-blue-50 text-blue-700 border border-blue-200",
                  };
                  const severityLabel: Record<string, string> = {
                    high: "높음",
                    medium: "중간",
                    low: "낮음",
                  };
                  const badgeCls = severityStyle[anomaly.severity] ?? severityStyle.low;
                  return (
                    <li key={anomaly.id} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeCls}`}>
                        {severityLabel[anomaly.severity] ?? anomaly.severity}
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
            {insightsQuery.isLoading ? (
              <p className="mt-2 text-sm text-slate-400">불러오는 중...</p>
            ) : (insightsQuery.data?.top_changed_items ?? []).length === 0 ? (
              <p className="mt-2 text-sm text-slate-400">변동 품목이 없습니다.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {(insightsQuery.data?.top_changed_items ?? []).map((item) => {
                  const pct = Math.round(item.change_ratio * 100);
                  const isUp = pct >= 0;
                  return (
                    <li key={item.item_nm} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{item.item_nm}</p>
                        <p className="text-xs text-slate-500">평균 {item.avg_ord_qty.toFixed(1)}개 → 최근 {item.latest_ord_qty}개</p>
                      </div>
                      <p className={`flex items-center gap-0.5 text-sm font-bold ${isUp ? "text-rose-600" : "text-blue-600"}`}>
                        <span className="material-symbols-outlined text-[14px]">{isUp ? "arrow_upward" : "arrow_downward"}</span>
                        {isUp ? "+" : ""}{pct}%
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </article>
        </div>
      </section>
      <OrderingHistorySection data={historyQuery.data} isLoading={historyQuery.isLoading} />
    </div>
  );
}
