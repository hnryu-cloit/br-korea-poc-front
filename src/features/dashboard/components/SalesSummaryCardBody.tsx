import { ArrowDown, ArrowUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SummaryCardSection } from "@/features/dashboard/components/SummaryCardSection";
import type { DashboardSalesSummaryCard } from "@/features/dashboard/types/dashboard";
import type { SalesSummaryTrendPanel } from "@/features/dashboard/types/summary-card";
import { buildSalesSummaryTrendPanels } from "@/features/dashboard/utils/summary-card";

function formatWon(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

function SalesMiniChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}) {
  if (!active || !payload?.length || typeof payload[0]?.value !== "number") {
    return null;
  }

  return (
    <div className="rounded-[12px] border border-[#E8D8CB] bg-white px-3 py-2 shadow-[0_8px_20px_rgba(124,65,23,0.1)]">
      <p className="text-[12px] font-semibold text-[#7C4117]">{label}</p>
      <p className="mt-0.5 text-[13px] font-bold text-[#FF6B1A]">{formatWon(payload[0].value)}</p>
    </div>
  );
}

function buildDeltaText(panel: SalesSummaryTrendPanel) {
  const diff = panel.sales - panel.previousSales;
  const absDiff = Math.abs(diff).toLocaleString("ko-KR");

  return {
    diff,
    text: `${panel.comparisonLabel}보다 ${absDiff}원`,
  };
}

function SalesMiniChart({ panel }: { panel: SalesSummaryTrendPanel }) {
  const currentPointIndex = panel.chartData.length - 1;

  return (
    <div className="mt-4 h-[92px] rounded-[2px] border border-[#DDD6CF] bg-white">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={panel.chartData} margin={{ top: 12, right: 6, left: 6, bottom: 6 }}>
          <CartesianGrid
            stroke="#D9D9D9"
            horizontalCoordinatesGenerator={({ offset }) => {
              const top = offset.top ?? 0;
              const height = offset.height ?? 0;
              return [top + height / 2];
            }}
            verticalCoordinatesGenerator={({ offset }) => {
              const left = offset.left ?? 0;
              const width = offset.width ?? 0;
              return [1, 2, 3, 4].map((step) => left + (width * step) / 5);
            }}
          />
          <XAxis dataKey="label" hide />
          <YAxis
            hide
            domain={[0, (dataMax: number) => Math.max(Math.round(dataMax * 1.18), 1)]}
          />
          <Tooltip content={<SalesMiniChartTooltip />} cursor={false} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#FFA16C"
            strokeWidth={1.8}
            fill="transparent"
            fillOpacity={0}
            dot={({ cx, cy, index }) => {
              if (typeof cx !== "number" || typeof cy !== "number") {
                return null;
              }

              const isCurrentPoint = index === currentPointIndex;

              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={isCurrentPoint ? 4.2 : 3}
                  fill={isCurrentPoint ? "#F97316" : "#FFB089"}
                  stroke={isCurrentPoint ? "#F97316" : "#FFB089"}
                  strokeWidth={1}
                />
              );
            }}
            activeDot={{ r: 5, fill: "#F97316", stroke: "#FFFFFF", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function SalesSummaryMetricCard({ panel }: { panel: SalesSummaryTrendPanel }) {
  const delta = buildDeltaText(panel);
  const isPositive = delta.diff >= 0;

  return (
    <article className="rounded-[14px] border border-[#D9D3CD] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <p className="text-md leading-[1.4] font-bold tracking-[-0.02em] text-[#2E2520]">
          {panel.name.replace(" 매출", "")}
        </p>
        <div className="text-right">
          <p className="text-md leading-[1.4] font-bold tracking-[-0.02em] text-orange-500">
            {formatWon(panel.sales)}
          </p>
          <div className="mt-1 flex items-center justify-end gap-1 text-[14px] leading-5 text-[#653819]">
            <span>{delta.text}</span>
            {isPositive ? (
              <ArrowUp className="h-5 w-5 text-[#FF3B30]" strokeWidth={2.4} />
            ) : (
              <ArrowDown className="h-5 w-5 text-[#2563EB]" strokeWidth={2.4} />
            )}
          </div>
        </div>
      </div>

      <SalesMiniChart panel={panel} />
    </article>
  );
}

export function SalesSummaryCardBody({ card }: { card: DashboardSalesSummaryCard }) {
  const panels = buildSalesSummaryTrendPanels(card.sales_overview);

  return (
    <SummaryCardSection title="매출 요약">
      <div className="flex flex-col gap-3">
        {panels.map((panel) => (
          <SalesSummaryMetricCard key={panel.key} panel={panel} />
        ))}
      </div>
    </SummaryCardSection>
  );
}
