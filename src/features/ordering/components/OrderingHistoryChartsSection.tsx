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
  items,
  topChangedItems,
  isLoading,
  dateFrom,
  dateTo,
}: Props) {
  const rangeDateKeys = enumerateDateKeys(dateFrom, dateTo);
  // 날짜별 발주량/확정량 집계
  const dailyMap = new Map<string, { 발주량: number; 확정량: number }>();
  for (const item of items) {
    const day = normalizeDateKey(item.dlv_dt);
    if (!day) continue;
    const prev = dailyMap.get(day) ?? { 발주량: 0, 확정량: 0 };
    dailyMap.set(day, {
      발주량: prev.발주량 + (item.ord_qty ?? 0),
      확정량: prev.확정량 + (item.confrm_qty ?? 0),
    });
  }
  const dailyTrend =
    rangeDateKeys.length > 0
      ? rangeDateKeys.map((day) => {
          const daily = dailyMap.get(day) ?? { 발주량: 0, 확정량: 0 };
          return { day, ...daily };
        })
      : Array.from(dailyMap.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([day, v]) => ({ day, ...v }));

  // 날짜별 수동 건수
  const typeMap = new Map<string, { 수동: number }>();
  for (const item of items) {
    const day = normalizeDateKey(item.dlv_dt);
    if (!day) continue;
    const prev = typeMap.get(day) ?? { 수동: 0 };
    typeMap.set(day, {
      수동: prev.수동 + (item.is_auto ? 0 : 1),
    });
  }
  const typeByDay =
    rangeDateKeys.length > 0
      ? rangeDateKeys.map((day) => {
          const type = typeMap.get(day) ?? { 수동: 0 };
          return { day, ...type };
        })
      : Array.from(typeMap.entries())
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
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} interval={0} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <Tooltip
                formatter={(value, name) => [
                  `${Number(value ?? 0).toLocaleString()}개`,
                  String(name),
                ]}
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

      {/* 차트 2: 날짜별 수동 건수 */}
      <ChartCard title="날짜별 수동 발주 건수" subtitle="is_auto 기준 스택">
        {isLoading ? (
          <Loading />
        ) : typeByDay.length === 0 ? (
          <Empty />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={typeByDay} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} interval={0} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} allowDecimals={false} />
              <Tooltip
                formatter={(value, name) => [`${Number(value ?? 0)}건`, String(name)]}
                contentStyle={TooltipStyle}
              />
              <Bar dataKey="수동" stackId="s" fill="#ED8CC280" radius={[4, 4, 0, 0]} />
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
                formatter={(value) => {
                  const ratio = Number(value ?? 0);
                  return [`${ratio > 0 ? "+" : ""}${ratio}%`, "변화율"];
                }}
                contentStyle={TooltipStyle}
              />
              <Bar dataKey="변화율" radius={[0, 6, 6, 0]}>
                {changedBar.map((entry, i) => (
                  <Cell key={i} fill={entry.변화율 >= 0 ? "#FF8D57B2" : "#2d6bff"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </section>
  );
}
