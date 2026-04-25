import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
} from "recharts";

import { InfoPopover } from "@/commons/components/info/InfoPopover";
import { FIELD_CAPTIONS } from "@/commons/constants/field-captions";
import type { SalesSummaryResponse } from "@/features/sales/types/sales";

const PALETTE = ["#FFAF89", "#8EC5FF", "#76CA9B", "#ED8CC2", "#F5CD47", "#A898F9"];
const PROFIT_PALETTE = ["#2d6bff", "#e2eaff"];

const fmtWon = (v: number) =>
  v >= 10_000 ? `${Math.round(v / 10_000).toLocaleString()}만` : v.toLocaleString();
const fmtPct = (v: number) => `${v.toFixed(1)}%`;

type ChartCardProps = {
  title: string;
  subtitle?: string;
  captionKey?: string;
  className?: string;
  children: React.ReactNode;
};

const ChartCard = ({ title, subtitle, captionKey, className = "", children }: ChartCardProps) => (
  <article
    className={`rounded-[28px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)] ${className}`}
  >
    <div className="mb-4 flex items-center gap-2">
      <p className="text-sm font-bold text-slate-800">{title}</p>
      {captionKey && FIELD_CAPTIONS[captionKey] && (
        <InfoPopover caption={FIELD_CAPTIONS[captionKey]} side="bottom" align="left" />
      )}
      {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
    </div>
    {children}
  </article>
);

const LoadingPlaceholder = () => (
  <p className="py-8 text-center text-sm text-slate-400">차트 데이터를 불러오는 중...</p>
);
const EmptyPlaceholder = () => (
  <p className="py-8 text-center text-sm text-slate-400">표시할 데이터가 없습니다.</p>
);

const CustomTooltipStyle = {
  fontSize: 12,
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

type CustomTreemapContentProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  fill?: string;
};

const CustomTreemapContent = (props: CustomTreemapContentProps) => {
  const { x = 0, y = 0, width = 0, height = 0, name = "", fill } = props;
  if (width < 30 || height < 20) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} rx={6} ry={6} />
      {width > 60 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize={11}
          fontWeight={600}
        >
          {name.length > 8 ? name.slice(0, 8) + "…" : name}
        </text>
      )}
    </g>
  );
};

export const SalesV2ChartsSection = ({
  summary,
  isLoading,
  dateFrom,
  dateTo,
}: {
  summary?: SalesSummaryResponse;
  isLoading: boolean;
  dateFrom: string;
  dateTo: string;
}) => {
  const weekly = summary?.weekly_data ?? [];
  const topProducts = (summary?.top_products ?? []).slice(0, 6);

  // Stacked Bar: 주간 매출 구성 (순매출 + 차감비용)
  const stackedWeekly = weekly.map((item) => ({
    day: item.day,
    순매출: item.net_revenue,
    차감비용: Math.max(0, item.revenue - item.net_revenue),
  }));

  // Horizontal Bar: 상위 상품
  const productBar = topProducts.map((item) => ({
    name: item.name.length > 9 ? item.name.slice(0, 9) + "…" : item.name,
    fullName: item.name,
    매출: item.sales,
  }));

  // Pie: 수익 구성
  const todayRevenue = summary?.today_revenue ?? 0;
  const todayProfit = summary?.estimated_today_profit ?? 0;
  const todayCost = Math.max(0, todayRevenue - todayProfit);
  const profitPie =
    todayRevenue > 0
      ? [
          { name: "추정 이익", value: todayProfit },
          { name: "비용 추정", value: todayCost },
        ]
      : [];

  // Radar: 핵심 지표 (0–100 정규화)
  const netRatio =
    todayRevenue > 0
      ? Math.min(100, Math.round((summary!.today_net_revenue / todayRevenue) * 100))
      : 0;
  const profitRatio =
    todayRevenue > 0 ? Math.min(100, Math.round((todayProfit / todayRevenue) * 100)) : 0;
  const marginScore = Math.min(100, Math.round((summary?.avg_margin_rate ?? 0) * 100));
  const diversityScore = Math.min(100, topProducts.length * 17);
  const unitScore = Math.min(
    100,
    Math.round(((summary?.avg_net_profit_per_item ?? 0) / 8_000) * 100),
  );
  const radarData = [
    { subject: "마진율", value: marginScore },
    { subject: "순매출 비율", value: netRatio },
    { subject: "수익성", value: profitRatio },
    { subject: "메뉴 다양성", value: diversityScore },
    { subject: "객단가 지수", value: unitScore },
  ];

  // Treemap: 상품 비중
  const treemapData = topProducts.map((item, i) => ({
    name: item.name,
    size: item.sales,
    fill: PALETTE[i % PALETTE.length],
  }));

  return (
    <section className="grid gap-4 xl:grid-cols-2">
      {/* 1. Area Chart: 주간 매출 / 순매출 추이 (full width) */}
      <ChartCard
        title="주간 매출 / 순매출 추이"
        subtitle={`${dateFrom} ~ ${dateTo} 기간 기준`}
        captionKey="sales:weekly_revenue_trend"
        className="xl:col-span-2"
      >
        {isLoading ? (
          <LoadingPlaceholder />
        ) : weekly.length === 0 ? (
          <EmptyPlaceholder />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weekly} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#bfd5ff" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#bfd5ff" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="gradNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2d6bff" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#2d6bff" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tickFormatter={fmtWon} tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <Tooltip
                formatter={(value, name) => [
                  `${Number(value ?? 0).toLocaleString()}원`,
                  String(name),
                ]}
                contentStyle={CustomTooltipStyle}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="매출"
                stroke="#bfd5ff"
                fill="url(#gradRevenue)"
                strokeWidth={2}
                dot={{ r: 3, fill: "#bfd5ff" }}
                activeDot={{ r: 5 }}
              />
              <Area
                type="monotone"
                dataKey="net_revenue"
                name="순매출"
                stroke="#2d6bff"
                fill="url(#gradNet)"
                strokeWidth={2}
                dot={{ r: 3, fill: "#2d6bff" }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* 2. Stacked Bar Chart: 주간 매출 구성 */}
      <ChartCard title="주간 매출 구성" subtitle="순매출 + 차감비용 (누적 막대)" captionKey="sales:weekly_revenue_composition">
        {isLoading ? (
          <LoadingPlaceholder />
        ) : stackedWeekly.length === 0 ? (
          <EmptyPlaceholder />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stackedWeekly} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tickFormatter={fmtWon} tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <Tooltip
                formatter={(value, name) => [
                  `${Number(value ?? 0).toLocaleString()}원`,
                  String(name),
                ]}
                contentStyle={CustomTooltipStyle}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="순매출" stackId="s" fill="#8EC5FF" radius={[0, 0, 0, 0]} />
              <Bar dataKey="차감비용" stackId="s" fill="#ED8CC2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* 3. Pie Chart: 수익 구성 */}
      <ChartCard title="오늘 수익 구성" subtitle="추정 이익 vs 비용 비율" captionKey="sales:today_profit_composition">
        {isLoading ? (
          <LoadingPlaceholder />
        ) : profitPie.length === 0 ? (
          <EmptyPlaceholder />
        ) : (
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={180}>
              <PieChart>
                <Pie
                  data={profitPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={78}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {profitPie.map((_, i) => (
                    <Cell key={i} fill={PROFIT_PALETTE[i]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${Number(value ?? 0).toLocaleString()}원`]}
                  contentStyle={CustomTooltipStyle}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3">
              {profitPie.map((entry, i) => (
                <div key={entry.name} className="flex items-start gap-2">
                  <div
                    className="mt-0.5 h-3 w-3 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: PROFIT_PALETTE[i] }}
                  />
                  <div>
                    <p className="text-xs text-slate-500">{entry.name}</p>
                    <p className="text-sm font-semibold text-slate-800">{fmtWon(entry.value)}원</p>
                  </div>
                </div>
              ))}
              {todayRevenue > 0 && (
                <div className="mt-1 rounded-lg bg-blue-50 px-3 py-2">
                  <p className="text-xs text-blue-500">순이익률</p>
                  <p className="text-sm font-bold text-blue-700">
                    {fmtPct((todayProfit / todayRevenue) * 100)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </ChartCard>

      {/* 4. Horizontal Bar Chart: 상위 상품 매출 */}
      <ChartCard title="상위 상품 매출 Top 6" subtitle="최근 집계 기준 판매 금액 순" captionKey="sales:top_products">
        {isLoading ? (
          <LoadingPlaceholder />
        ) : productBar.length === 0 ? (
          <EmptyPlaceholder />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={productBar}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 4, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={fmtWon}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: "#64748b" }}
                width={75}
              />
              <Tooltip
                formatter={(value) => [`${Number(value ?? 0).toLocaleString()}원`, "매출"]}
                contentStyle={CustomTooltipStyle}
              />
              <Bar dataKey="매출" radius={[0, 6, 6, 0]}>
                {productBar.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* 5. Radar Chart: 핵심 지표 현황 */}
      <ChartCard title="핵심 지표 현황" subtitle="주요 경영 지표 다차원 비교 (0–100 정규화)" captionKey="sales:core_indicators">
        {isLoading ? (
          <LoadingPlaceholder />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart cx="50%" cy="50%" outerRadius={72} data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#64748b" }} />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fontSize: 9, fill: "#94a3b8" }}
                tickCount={4}
              />
              <Radar
                name="현재 지표"
                dataKey="value"
                stroke="#2d6bff"
                fill="#2d6bff"
                fillOpacity={0.25}
                dot={{ r: 3, fill: "#2d6bff" }}
              />
              <Tooltip
                formatter={(value) => [`${Number(value ?? 0)}점 / 100`]}
                contentStyle={CustomTooltipStyle}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* 6. Treemap: 상품별 매출 비중 (full width) */}
      <ChartCard
        title="상품별 매출 비중"
        subtitle="전체 매출 대비 상품별 면적 비중"
        captionKey="sales:product_revenue_share"
        className="xl:col-span-2"
      >
        {isLoading ? (
          <LoadingPlaceholder />
        ) : treemapData.length === 0 ? (
          <EmptyPlaceholder />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <Treemap
                data={treemapData}
                dataKey="size"
                aspectRatio={4 / 3}
                content={<CustomTreemapContent />}
              />
            </ResponsiveContainer>
            <div className="mt-3 flex flex-wrap gap-3">
              {treemapData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                  />
                  <span className="text-xs text-slate-600">{item.name}</span>
                  <span className="text-xs font-semibold text-slate-800">
                    {fmtWon(item.size)}원
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </ChartCard>
    </section>
  );
};
