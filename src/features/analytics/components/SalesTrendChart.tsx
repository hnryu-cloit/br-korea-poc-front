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

import type { SalesTrendResponse } from "@/features/analytics/types/analytics";

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

function HeadlineBadge({ headline, trend }: { headline: string; trend: string }) {
  const colorClass =
    trend === "up"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : trend === "down"
        ? "bg-red-50 text-red-700 border-red-200"
        : "bg-slate-50 text-slate-600 border-slate-200";
  return (
    <p className={`inline-block rounded-full border px-4 py-1.5 text-sm font-semibold ${colorClass}`}>
      {headline}
    </p>
  );
}

function CumulativeChart({ points }: { points: SalesTrendResponse["points"] }) {
  const data = points.map((p) => ({
    day: `${p.day}일`,
    이번달: p.this_month,
    지난달: p.last_month,
    예측: p.projection,
  }));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="day" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={formatAmt} width={48} />
        <Tooltip formatter={(v) => (typeof v === "number" ? `${v.toLocaleString("ko-KR")}원` : "")} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="지난달" stroke="#cbd5e1" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="이번달" stroke="#2563eb" strokeWidth={2.5} dot={false} />
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
    이번달평균: p.this_month_avg,
    지난달평균: p.last_month_avg,
  }));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={formatAmt} width={48} />
        <Tooltip formatter={(v) => (typeof v === "number" ? `${v.toLocaleString("ko-KR")}원` : "")} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="지난달평균" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
        <Bar dataKey="이번달평균" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function HourChart({ points }: { points: SalesTrendResponse["hour_points"] }) {
  const data = points.map((p) => ({
    name: `${p.hour}시`,
    이번달: p.this_month_avg,
    지난달: p.last_month_avg,
  }));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={1} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={formatAmt} width={48} />
        <Tooltip formatter={(v) => (typeof v === "number" ? `${v.toLocaleString("ko-KR")}원` : "")} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="지난달" stroke="#cbd5e1" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="이번달" stroke="#2563eb" strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SalesTrendChart({ data, isLoading }: { data?: SalesTrendResponse; isLoading: boolean }) {
  const [activeTab, setActiveTab] = useState<Tab>("cumulative");

  if (isLoading) {
    return (
      <section className="overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <div className="px-6 py-8 text-sm text-slate-400">매출 추이 데이터를 불러오는 중...</div>
      </section>
    );
  }

  if (!data) return null;

  return (
    <section className="overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="border-b border-border/60 px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-slate-900">매출 추이 분석</p>
            <p className="mt-1 text-sm text-slate-500">이번 달 vs 지난달 · 요일별 · 시간대별 비교</p>
          </div>
          <HeadlineBadge headline={data.headline} trend={data.headline_trend} />
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
          <p className="mb-2 text-xs font-semibold text-slate-400">채널별 이번달 매출</p>
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