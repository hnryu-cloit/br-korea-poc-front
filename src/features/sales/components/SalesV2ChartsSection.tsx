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
import { SalesChartsSkeleton } from "@/features/sales/components/SalesSkeletons";
import type { SalesSummaryResponse } from "@/features/sales/types/sales";

const PALETTE = [
  "#FFAF89",
  "#8EC5FF",
  "#76CA9B",
  "#ED8CC2",
  "#F5CD47",
  "#A898F9",
  "#7ED9D0",
  "#FF9F9F",
  "#B6D86A",
  "#C99BE8",
];
const PROFIT_PALETTE = ["#2d6bff", "#e2eaff"];

const DIVERSITY_SHARE_THRESHOLD = 0.05;
const DIVERSITY_TARGET_COUNT = 10;

const fmtWon = (v: number) =>
  v >= 10_000 ? `${Math.round(v / 10_000).toLocaleString()}만` : v.toLocaleString();

const parseIsoDate = (value: string) => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

const buildWeeklyAxisLabel = (dateFrom: string, index: number, dayLabel: string) => {
  const baseDate = parseIsoDate(dateFrom);
  if (!baseDate) return dayLabel;
  const valueDate = new Date(baseDate);
  valueDate.setDate(baseDate.getDate() + index);
  const year = valueDate.getFullYear();
  const month = String(valueDate.getMonth() + 1).padStart(2, "0");
  const day = String(valueDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}(${dayLabel})`;
};

type ChartCardProps = {
  title: string;
  subtitle?: string;
  captionKey?: string;
  className?: string;
  children: React.ReactNode;
};

const ChartCard = ({ title, subtitle, captionKey, className = "", children }: ChartCardProps) => (
  <article
    className={`rounded-[6px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)] ${className}`}
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

const EmptyPlaceholder = () => (
  <p className="py-8 text-center text-sm text-slate-400">표시할 데이터가 없습니다.</p>
);

const customTooltipStyle = {
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
  percent?: number;
};

const CustomTreemapContent = (props: CustomTreemapContentProps) => {
  const { x = 0, y = 0, width = 0, height = 0, name = "", fill, percent } = props;
  if (width < 30 || height < 20) return null;
  const showLabel = width > 60 && height > 30;
  const showPercent = typeof percent === "number" && width > 50 && height > 44;
  const labelY = showPercent ? y + height / 2 - 8 : y + height / 2;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} rx={6} ry={6} />
      {showLabel && (
        <text
          x={x + width / 2}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize={11}
          fontWeight={600}
        >
          {name.length > 8 ? `${name.slice(0, 8)}…` : name}
        </text>
      )}
      {showPercent && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize={11}
          fontWeight={700}
          opacity={0.9}
        >
          {`${percent.toFixed(1)}%`}
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
  if (isLoading) {
    return <SalesChartsSkeleton />;
  }

  const weekly = summary?.weekly_data ?? [];
  const allProducts = summary?.top_products ?? [];
  const topProducts = allProducts.slice(0, 10);
  const groupRevenueShare = summary?.group_revenue_share ?? [];

  const weeklyWithAxisLabel = weekly.map((item, index) => ({
    ...item,
    axisLabel: buildWeeklyAxisLabel(dateFrom, index, item.day),
  }));

  const stackedWeekly = weeklyWithAxisLabel.map((item) => ({
    axisLabel: item.axisLabel,
    순매출: item.net_revenue,
    차감비용: Math.max(0, item.revenue - item.net_revenue),
  }));

  const productBar = topProducts.map((item) => ({
    name: item.name.length > 9 ? `${item.name.slice(0, 9)}…` : item.name,
    fullName: item.name,
    매출: item.sales,
  }));

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

  const netRatio =
    todayRevenue > 0
      ? Math.min(100, Math.round(((summary?.today_net_revenue ?? 0) / todayRevenue) * 100))
      : 0;
  const profitRatio =
    todayRevenue > 0 ? Math.min(100, Math.round((todayProfit / todayRevenue) * 100)) : 0;
  const marginScore = Math.min(100, Math.round((summary?.avg_margin_rate ?? 0) * 100));
  const totalProductSales = allProducts.reduce((sum, item) => sum + (item.sales ?? 0), 0);
  const diversityCount =
    totalProductSales > 0
      ? allProducts.filter(
          (item) => (item.sales ?? 0) / totalProductSales >= DIVERSITY_SHARE_THRESHOLD,
        ).length
      : 0;
  const diversityScore = Math.min(
    100,
    Math.round((diversityCount / DIVERSITY_TARGET_COUNT) * 100),
  );
  const ticketIndex = Math.max(0, Math.min(100, Math.round(summary?.avg_ticket_index ?? 0)));
  const ticketSize = Math.round(summary?.avg_ticket_size ?? 0);

  const radarData = [
    { subject: "마진율", value: marginScore },
    { subject: "순매출 비율", value: netRatio },
    { subject: "수익률", value: profitRatio },
    { subject: "메뉴 다양성", value: diversityScore },
    {
      subject: "평균 객단가",
      value: ticketIndex,
      displayValue: `${ticketSize.toLocaleString()}원`,
    },
  ];

  const treemapTotalSales = groupRevenueShare.reduce((sum, item) => sum + (item.sales ?? 0), 0);
  const treemapData = groupRevenueShare.map((item, i) => ({
    name: item.name,
    size: item.sales,
    fill: PALETTE[i % PALETTE.length],
    percent: treemapTotalSales > 0 ? ((item.sales ?? 0) / treemapTotalSales) * 100 : 0,
  }));

  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <ChartCard
        title="주간 매출 / 순매출 추이"
        subtitle={`${dateFrom} ~ ${dateTo} 기간 기준`}
        captionKey="sales:weekly_revenue_trend"
        className="xl:col-span-2"
      >
        {weekly.length === 0 ? (
          <EmptyPlaceholder />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={weeklyWithAxisLabel}
              margin={{ top: 8, right: 16, left: -10, bottom: 40 }}
            >
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
              <XAxis
                dataKey="axisLabel"
                height={56}
                interval={0}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                angle={-35}
                textAnchor="end"
              />
              <YAxis tickFormatter={fmtWon} tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <Tooltip
                formatter={(value, name) => [
                  `${Number(value ?? 0).toLocaleString()}원`,
                  String(name),
                ]}
                contentStyle={customTooltipStyle}
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

      <ChartCard
        title="주간 매출 구성"
        subtitle="순매출과 차감비용 구성"
        captionKey="sales:weekly_revenue_composition"
      >
        {stackedWeekly.length === 0 ? (
          <EmptyPlaceholder />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stackedWeekly} margin={{ top: 4, right: 8, left: -10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="axisLabel"
                height={56}
                interval={0}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                angle={-35}
                textAnchor="end"
              />
              <YAxis tickFormatter={fmtWon} tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <Tooltip
                formatter={(value, name) => [
                  `${Number(value ?? 0).toLocaleString()}원`,
                  String(name),
                ]}
                contentStyle={customTooltipStyle}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="순매출" stackId="s" fill="#8EC5FF" radius={[0, 0, 0, 0]} />
              <Bar dataKey="차감비용" stackId="s" fill="#ED8CC2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard
        title="오늘 수익 구성"
        subtitle="매출 대비 추정 이익과 비용"
        captionKey="sales:today_profit_composition"
      >
        {profitPie.length === 0 ? (
          <EmptyPlaceholder />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={profitPie}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={70}
                paddingAngle={2}
              >
                {profitPie.map((entry, index) => (
                  <Cell key={entry.name} fill={PROFIT_PALETTE[index % PROFIT_PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  `${Number(value ?? 0).toLocaleString()}원`,
                  String(name),
                ]}
                contentStyle={customTooltipStyle}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard
        title="상위 상품 매출 Top 10"
        subtitle="조회 기간 매출 상위 상품"
        captionKey="sales:top_products"
      >
        {productBar.length === 0 ? (
          <EmptyPlaceholder />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={productBar}
              layout="vertical"
              margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                type="number"
                tickFormatter={fmtWon}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={90}
                tick={{ fontSize: 11, fill: "#475569" }}
              />
              <Tooltip
                formatter={(value, _name, payload) => [
                  `${Number(value ?? 0).toLocaleString()}원`,
                  payload?.payload?.fullName ?? "매출",
                ]}
                contentStyle={customTooltipStyle}
              />
              <Bar dataKey="매출" radius={[0, 10, 10, 0]}>
                {productBar.map((item, index) => (
                  <Cell key={item.fullName} fill={PALETTE[index % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard
        title="핵심 지표 현황"
        subtitle="수익성과 구성 지표 요약"
        captionKey="sales:core_indicators"
      >
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#64748b" }} />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
            />
            <Radar
              name="지표 점수"
              dataKey="value"
              stroke="#2454C8"
              fill="#8EC5FF"
              fillOpacity={0.45}
            />
            <Tooltip
              formatter={(value, _name, payload) => [
                payload?.payload?.displayValue ?? `${Number(value ?? 0).toFixed(1)}점`,
                payload?.payload?.subject ?? "지표",
              ]}
              contentStyle={customTooltipStyle}
            />
          </RadarChart>
        </ResponsiveContainer>
        <div className="mt-3 flex items-center justify-between rounded-lg bg-[#f8fbff] px-3 py-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <span>평균 객단가</span>
            <InfoPopover
              caption={FIELD_CAPTIONS["sales:avg_ticket_index"]}
              side="top"
              align="left"
            />
          </span>
          <span className="text-xs font-bold text-slate-800">
            {ticketSize.toLocaleString()}원
            <span className="ml-1.5 text-[#2454C8]">({ticketIndex}/100)</span>
          </span>
        </div>
      </ChartCard>

      <ChartCard
        title="상품 그룹별 매출 비중"
        subtitle="전체 매출 대비 상품 그룹별 매출 비중"
        captionKey="sales:product_revenue_share"
        className="xl:col-span-2"
      >
        {treemapData.length === 0 ? (
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
                  <span className="text-xs font-semibold text-[#2454C8]">
                    {item.percent.toFixed(1)}%
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
