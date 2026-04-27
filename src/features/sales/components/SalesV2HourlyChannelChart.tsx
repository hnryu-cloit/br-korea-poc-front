import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { InfoPopover } from "@/commons/components/info/InfoPopover";
import { FIELD_CAPTIONS } from "@/commons/constants/field-captions";
import type { SalesHourlyChannelItem } from "@/features/sales/types/sales";

type SalesV2HourlyChannelChartProps = {
  items: SalesHourlyChannelItem[];
  isLoading: boolean;
  dateFrom: string;
  dateTo: string;
};

const fmtWon = (value: number) =>
  value >= 10_000 ? `${Math.round(value / 10_000).toLocaleString()}만` : value.toLocaleString();

const fmtHour = (hour: number) => `${String(hour).padStart(2, "0")}시`;

const BUSINESS_OPEN_HOUR = 6;
const BUSINESS_CLOSE_HOUR = 23;

const TooltipStyle = {
  fontSize: 12,
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

export const SalesV2HourlyChannelChart = ({
  items,
  isLoading,
  dateFrom,
  dateTo,
}: SalesV2HourlyChannelChartProps) => {
  const captionKey = "sales:hourly_channel_sales";
  const caption = FIELD_CAPTIONS[captionKey];
  const businessHourItems = items.filter(
    (item) => item.hour >= BUSINESS_OPEN_HOUR && item.hour <= BUSINESS_CLOSE_HOUR,
  );

  const chartData = businessHourItems.map((item) => ({
    hourLabel: fmtHour(item.hour),
    "오프라인+투고": item.offline_sales,
    배달: item.delivery_sales,
    판매건수: item.total_qty,
  }));

  const hasData = businessHourItems.some(
    (item) =>
      item.offline_sales > 0 ||
      item.delivery_sales > 0 ||
      item.offline_qty > 0 ||
      item.delivery_qty > 0,
  );

  return (
    <article className="rounded-[6px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="mb-4 flex items-center gap-2">
        <p className="text-sm font-bold text-slate-800">시간대별 판매건수 · 채널 매출</p>
        {caption && <InfoPopover caption={caption} side="bottom" align="left" />}
        <p className="text-xs text-slate-400">
          {dateFrom} ~ {dateTo} · {BUSINESS_OPEN_HOUR}~{BUSINESS_CLOSE_HOUR}시 집계
        </p>
      </div>

      {isLoading ? (
        <div className="flex h-[260px] animate-pulse items-center justify-center rounded bg-slate-50 text-xs text-slate-400">
          시간대별 데이터 불러오는 중...
        </div>
      ) : !hasData ? (
        <p className="py-8 text-center text-sm text-slate-400">표시할 데이터가 없습니다.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData} margin={{ top: 8, right: 16, left: -8, bottom: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="hourLabel" tick={{ fontSize: 11, fill: "#94a3b8" }} interval={1} />
            <YAxis
              yAxisId="left"
              tickFormatter={fmtWon}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              label={{
                value: "매출액",
                position: "insideTopLeft",
                offset: 0,
                fontSize: 10,
                fill: "#94a3b8",
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(value: number) => `${value.toLocaleString()}`}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              label={{
                value: "판매건수",
                position: "insideTopRight",
                offset: 0,
                fontSize: 10,
                fill: "#94a3b8",
              }}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === "판매건수") {
                  return [`${Number(value ?? 0).toLocaleString()}건`, String(name)];
                }
                return [`${Number(value ?? 0).toLocaleString()}원`, String(name)];
              }}
              contentStyle={TooltipStyle}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar
              yAxisId="left"
              dataKey="오프라인+투고"
              stackId="channel"
              fill="#8EC5FF"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              yAxisId="left"
              dataKey="배달"
              stackId="channel"
              fill="#FFAF89"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="판매건수"
              stroke="#2d6bff"
              strokeWidth={2}
              dot={{ r: 3, fill: "#2d6bff" }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </article>
  );
};
