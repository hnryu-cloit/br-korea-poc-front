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

import type {
  OrderingChangedItem,
  OrderingHistoryDailyTrendPoint,
  OrderingHistoryManualCountPoint,
} from "@/features/ordering/types/ordering";

type Props = {
  dailyTrend: OrderingHistoryDailyTrendPoint[];
  manualByDay: OrderingHistoryManualCountPoint[];
  topChangedItems: OrderingChangedItem[];
  isLoading: boolean;
  dateFrom?: string;
  dateTo?: string;
};

const TooltipStyle = {
  fontSize: 12,
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const ChartCard = ({
  title,
  subtitle,
  className = "",
  children,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <article
    className={`rounded-[6px] border border-border bg-white px-5 py-5 shadow-[0_10px_24px_rgba(16,32,51,0.06)] ${className}`}
  >
    <div className="flex items-center gap-1">
      <p className="text-sm font-bold text-[#1C1C1E]">{title}</p>
      {subtitle && <p className="text-xs text-[#6C6C70]">{subtitle}</p>}
    </div>
    {children}
  </article>
);

const Empty = () => (
  <p className="py-8 text-center text-sm text-slate-400">표시할 데이터가 없습니다.</p>
);

const Loading = () => <p className="py-8 text-center text-sm text-slate-400">불러오는 중...</p>;

const DAY_MS = 24 * 60 * 60 * 1000;

function normalizeDateKey(value: string | null | undefined): string | null {
  if (!value) return null;
  const digits = value.replace(/[^0-9]/g, "");
  if (digits.length !== 8) return null;
  return digits;
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function enumerateDateKeys(dateFrom?: string, dateTo?: string): string[] {
  const from = normalizeDateKey(dateFrom);
  const to = normalizeDateKey(dateTo);
  if (!from || !to) return [];

  const fromDate = new Date(`${from.slice(0, 4)}-${from.slice(4, 6)}-${from.slice(6, 8)}T00:00:00`);
  const toDate = new Date(`${to.slice(0, 4)}-${to.slice(4, 6)}-${to.slice(6, 8)}T00:00:00`);
  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) return [];

  const start = fromDate.getTime() <= toDate.getTime() ? fromDate : toDate;
  const end = fromDate.getTime() <= toDate.getTime() ? toDate : fromDate;
  const result: string[] = [];
  for (let cursor = start.getTime(); cursor <= end.getTime(); cursor += DAY_MS) {
    result.push(toDateKey(new Date(cursor)));
  }
  return result;
}

export function OrderingHistoryChartsSection({
  dailyTrend,
  manualByDay,
  topChangedItems,
  isLoading,
  dateFrom,
  dateTo,
}: Props) {
  const rangeDateKeys = enumerateDateKeys(dateFrom, dateTo);
  const dailyMap = new Map(
    dailyTrend
      .map((item) => {
        const day = normalizeDateKey(item.dlv_dt);
        return day
          ? [
              day,
              {
                발주량: item.ord_qty ?? 0,
                확정량: item.confrm_qty ?? 0,
              },
            ]
          : null;
      })
      .filter((entry): entry is [string, { 발주량: number; 확정량: number }] => entry !== null),
  );
  const manualMap = new Map(
    manualByDay
      .map((item) => {
        const day = normalizeDateKey(item.dlv_dt);
        return day ? [day, { 수동: item.manual_count ?? 0 }] : null;
      })
      .filter((entry): entry is [string, { 수동: number }] => entry !== null),
  );

  const dailyTrendData =
    rangeDateKeys.length > 0
      ? rangeDateKeys.map((day) => ({ day, ...(dailyMap.get(day) ?? { 발주량: 0, 확정량: 0 }) }))
      : Array.from(dailyMap.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([day, value]) => ({ day, ...value }));

  const manualByDayData =
    rangeDateKeys.length > 0
      ? rangeDateKeys.map((day) => ({ day, ...(manualMap.get(day) ?? { 수동: 0 }) }))
      : Array.from(manualMap.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([day, value]) => ({ day, ...value }));

  const changedBar = topChangedItems.map((item) => ({
    name: item.item_nm.length > 9 ? `${item.item_nm.slice(0, 9)}..` : item.item_nm,
    변화율: Math.round(item.change_ratio * 100),
  }));

  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <ChartCard
        title="날짜별 발주량 / 확정량 추이"
        subtitle="조회 기간 전체 집계"
        className="xl:col-span-2"
      >
        {isLoading ? (
          <Loading />
        ) : dailyTrendData.length === 0 ? (
          <Empty />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyTrendData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
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
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} interval={0} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <Tooltip
                formatter={(value, name) => [`${Number(value ?? 0).toLocaleString()}개`, String(name)]}
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

      <ChartCard title="날짜별 수동 발주 건수">
        {isLoading ? (
          <Loading />
        ) : manualByDayData.length === 0 ? (
          <Empty />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={manualByDayData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} interval={0} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} allowDecimals={false} />
              <Tooltip
                formatter={(value, name) => [`${Number(value ?? 0)}건`, String(name)]}
                contentStyle={TooltipStyle}
              />
              <Bar dataKey="수동" fill="#ED8CC280" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="주요 변동 품목 변화율" subtitle="조회 기간 기준 최근 발주량 변화 (%)">
        {isLoading ? (
          <Loading />
        ) : changedBar.length === 0 ? (
          <Empty />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={changedBar}
              layout="vertical"
              margin={{ top: 4, right: 24, left: 20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(value: number) => `${value > 0 ? "+" : ""}${value}%`}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: "#64748b" }}
                width={78}
              />
              <Tooltip
                formatter={(value) => {
                  const ratio = Number(value ?? 0);
                  return [`${ratio > 0 ? "+" : ""}${ratio}%`, "변화율"];
                }}
                contentStyle={TooltipStyle}
              />
              <Bar dataKey="변화율" radius={[0, 6, 6, 0]}>
                {changedBar.map((entry, index) => (
                  <Cell key={index} fill={entry.변화율 >= 0 ? "#FF8D57B2" : "#2d6bff"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </section>
  );
}
