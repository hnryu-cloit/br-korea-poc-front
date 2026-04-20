import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { OrderingChangedItem, OrderingHistoryItem } from "@/features/ordering/types/ordering";

type Props = {
  items: OrderingHistoryItem[];
  topChangedItems: OrderingChangedItem[];
  isLoading: boolean;
};

const TooltipStyle = {
  fontSize: 12,
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const ChartCard = ({ title, subtitle, className = "", children }: {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <article className={`rounded-[24px] border border-border bg-white px-5 py-5 shadow-[0_10px_24px_rgba(16,32,51,0.06)] ${className}`}>
    <div className="mb-4">
      <p className="text-sm font-bold text-slate-800">{title}</p>
      {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
    </div>
    {children}
  </article>
);

const Empty = () => (
  <p className="py-8 text-center text-sm text-slate-400">표시할 데이터가 없습니다.</p>
);

const Loading = () => (
  <p className="py-8 text-center text-sm text-slate-400">불러오는 중...</p>
);

export function OrderingHistoryChartsSection({ items, topChangedItems, isLoading }: Props) {
  // 날짜별 발주량/확정량 집계
  const dailyMap = new Map<string, { 발주량: number; 확정량: number }>();
  for (const item of items) {
    const day = item.dlv_dt ?? "미정";
    const prev = dailyMap.get(day) ?? { 발주량: 0, 확정량: 0 };
    dailyMap.set(day, {
      발주량: prev.발주량 + (item.ord_qty ?? 0),
      확정량: prev.확정량 + (item.confrm_qty ?? 0),
    });
  }
  const dailyTrend = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, v]) => ({ day, ...v }));

  // 날짜별 자동/수동 건수
  const typeMap = new Map<string, { 자동: number; 수동: number }>();
  for (const item of items) {
    const day = item.dlv_dt ?? "미정";
    const prev = typeMap.get(day) ?? { 자동: 0, 수동: 0 };
    typeMap.set(day, {
      자동: prev.자동 + (item.is_auto ? 1 : 0),
      수동: prev.수동 + (item.is_auto ? 0 : 1),
    });
  }
  const typeByDay = Array.from(typeMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, v]) => ({ day, ...v }));

  // 주요 변동 품목 변화율
  const changedBar = topChangedItems.map((item) => ({
    name: item.item_nm.length > 9 ? item.item_nm.slice(0, 9) + "…" : item.item_nm,
    변화율: Math.round(item.change_ratio * 100),
  }));

  return (
    <section className="grid gap-4 xl:grid-cols-2">
      {/* 차트 1: 날짜별 발주량 vs 확정량 (전체 폭) */}
      <ChartCard
        title="날짜별 발주량 / 확정량 추이"
        subtitle="납품일 기준 집계"
        className="xl:col-span-2"
      >
        {isLoading ? (
          <Loading />
        ) : dailyTrend.length === 0 ? (
          <Empty />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyTrend} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradOrd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="gradConfrm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2d6bff" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#2d6bff" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <Tooltip
                formatter={(value: number, name: string) => [`${value.toLocaleString()}개`, name]}
                contentStyle={TooltipStyle}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="발주량"
                stroke="#60a5fa"
                fill="url(#gradOrd)"
                strokeWidth={2}
                dot={{ r: 3, fill: "#60a5fa" }}
                activeDot={{ r: 5 }}
              />
              <Area
                type="monotone"
                dataKey="확정량"
                stroke="#2d6bff"
                fill="url(#gradConfrm)"
                strokeWidth={2}
                dot={{ r: 3, fill: "#2d6bff" }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* 차트 2: 날짜별 자동/수동 건수 */}
      <ChartCard title="날짜별 자동 / 수동 발주 건수" subtitle="is_auto 기준 스택">
        {isLoading ? (
          <Loading />
        ) : typeByDay.length === 0 ? (
          <Empty />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={typeByDay} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} allowDecimals={false} />
              <Tooltip
                formatter={(value: number, name: string) => [`${value}건`, name]}
                contentStyle={TooltipStyle}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="자동" stackId="s" fill="#2d6bff" radius={[0, 0, 0, 0]} />
              <Bar dataKey="수동" stackId="s" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* 차트 3: 주요 변동 품목 변화율 */}
      <ChartCard title="주요 변동 품목 변화율" subtitle="평균 대비 최근 발주량 변화 (%)">
        {isLoading ? (
          <Loading />
        ) : changedBar.length === 0 ? (
          <Empty />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={changedBar}
              layout="vertical"
              margin={{ top: 4, right: 24, left: 4, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(v: number) => `${v > 0 ? "+" : ""}${v}%`}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: "#64748b" }}
                width={78}
              />
              <Tooltip
                formatter={(value: number) => [`${value > 0 ? "+" : ""}${value}%`, "변화율"]}
                contentStyle={TooltipStyle}
              />
              <Bar dataKey="변화율" radius={[0, 6, 6, 0]}>
                {changedBar.map((entry, i) => (
                  <Cell key={i} fill={entry.변화율 >= 0 ? "#f43f5e" : "#2d6bff"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </section>
  );
}
