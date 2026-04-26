import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SalesTrendSkeleton } from "@/features/analytics/components/AnalyticsSkeletons";
import type {
  AnalyticsSalesTrendCompareMode,
  SalesTrendResponse,
} from "@/features/analytics/types/analytics";

type Tab = "cumulative" | "dow" | "hour";

const TAB_LABELS: Record<Tab, string> = {
  cumulative: "누적 비교",
  dow: "요일별",
  hour: "시간대별",
};

function formatAmt(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 10_000) return `${Math.round(value / 10_000)}만`;
  return String(value);
}

function formatDateLabel(value: string | null | undefined): string {
  if (!value) return "-";
  const normalized = value.replaceAll("-", "");
  if (normalized.length !== 8) return value;
  return `${normalized.slice(0, 4)}.${normalized.slice(4, 6)}.${normalized.slice(6, 8)}`;
}

function getComparisonLabel(mode: AnalyticsSalesTrendCompareMode): string {
  return mode === "prev_week" ? "전주" : "전월";
}

function HeadlineBadge({ headline, trend }: { headline: string; trend: string }) {
  const colorClass =
    trend === "up"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : trend === "down"
        ? "bg-red-50 text-red-700 border-red-200"
        : "bg-slate-50 text-slate-600 border-slate-200";
  return (
    <p
      className={`inline-block rounded-full border px-4 py-1.5 text-sm font-semibold ${colorClass}`}
    >
      {headline}
    </p>
  );
}

function CumulativeChart({ points }: { points: SalesTrendResponse["points"] }) {
  const data = points.map((p) => ({
    day: `${p.day}일`,
    선택기간: p.current_period,
    비교기간: p.comparison_period,
    예측: p.projection,
  }));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="day" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={formatAmt} width={48} />
        <Tooltip
          formatter={(v) => (typeof v === "number" ? `${v.toLocaleString("ko-KR")}원` : "")}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="비교기간" stroke="#cbd5e1" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="선택기간" stroke="#2563eb" strokeWidth={2.5} dot={false} />
        <Line
          type="monotone"
          dataKey="예측"
          stroke="#93c5fd"
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function DowChart({ points }: { points: SalesTrendResponse["dow_points"] }) {
  const data = points.map((p) => ({
    name: p.label,
    선택기간평균: p.current_period_avg,
    비교기간평균: p.comparison_period_avg,
  }));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={formatAmt} width={48} />
        <Tooltip
          formatter={(v) => (typeof v === "number" ? `${v.toLocaleString("ko-KR")}원` : "")}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="비교기간평균" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
        <Bar dataKey="선택기간평균" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function HourChart({ points }: { points: SalesTrendResponse["hour_points"] }) {
  const data = points.map((p) => ({
    name: `${p.hour}시`,
    선택기간: p.current_period_avg,
    비교기간: p.comparison_period_avg,
  }));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={1} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={formatAmt} width={48} />
        <Tooltip
          formatter={(v) => (typeof v === "number" ? `${v.toLocaleString("ko-KR")}원` : "")}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="비교기간" stroke="#cbd5e1" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="선택기간" stroke="#2563eb" strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SalesTrendChart({
  data,
  isLoading,
  compareMode,
  onChangeCompareMode,
}: {
  data?: SalesTrendResponse;
  isLoading: boolean;
  compareMode: AnalyticsSalesTrendCompareMode;
  onChangeCompareMode: (value: AnalyticsSalesTrendCompareMode) => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("cumulative");

  if (isLoading) {
    return <SalesTrendSkeleton />;
  }

  if (!data) return null;

  return (
    <section className="overflow-hidden rounded-[6px] border border-border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="border-b border-border/60 px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-slate-900">매출 추이 분석</p>
            <p className="mt-1 text-sm text-slate-500">
              선택 기간과 비교 기준으로 누적 · 요일별 · 시간대별 추이를 봅니다.
            </p>
            <p className="mt-2 text-xs text-slate-400">
              선택 기간 {formatDateLabel(data.date_from)} ~ {formatDateLabel(data.date_to)}
              {data.comparison_date_from && data.comparison_date_to
                ? ` · ${getComparisonLabel(data.compare_mode)} ${formatDateLabel(data.comparison_date_from)} ~ ${formatDateLabel(data.comparison_date_to)}`
                : ""}
            </p>
          </div>
          <HeadlineBadge headline={data.headline} trend={data.headline_trend} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-[#41352E]">비교 기준</p>
          {(["prev_month", "prev_week"] as AnalyticsSalesTrendCompareMode[]).map((mode) => (
            <label
              key={mode}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#DADADA] bg-white px-3 py-1.5 text-xs font-semibold text-[#45556C]"
            >
              <input
                type="radio"
                name="sales-trend-compare-mode"
                value={mode}
                checked={compareMode === mode}
                onChange={() => onChangeCompareMode(mode)}
                className="h-3.5 w-3.5 accent-[#653819]"
              />
              {mode === "prev_month" ? "전월 비교" : "전주 비교"}
            </label>
          ))}
        </div>

        {/* 탭 */}
        <div className="mt-4 flex gap-1">
          {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-[#1f4dbb] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-5">
        {activeTab === "cumulative" && <CumulativeChart points={data.points} />}
        {activeTab === "dow" && <DowChart points={data.dow_points} />}
        {activeTab === "hour" && <HourChart points={data.hour_points} />}
      </div>

      {/* 인사이트 chip */}
      {data.insight_chips.length > 0 && (
        <div className="border-t border-border/40 px-6 py-4">
          <p className="mb-2 text-xs font-semibold text-slate-400">조회 기간 채널별 매출</p>
          <div className="flex flex-wrap gap-2">
            {data.insight_chips.map((chip) => (
              <span
                key={chip.label}
                className="rounded-full bg-[#f7faff] border border-[#d8e5ff] px-3 py-1.5 text-xs font-medium text-slate-700"
              >
                {chip.label} · {chip.value}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
