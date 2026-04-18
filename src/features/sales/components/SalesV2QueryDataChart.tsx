import type { SalesVisualData } from "@/features/sales/types/sales";
import type { SalesV2Comparison } from "@/features/sales/types/sales-v2";

type ChartRow = {
  label: string;
  storeValue: number;
  peerValue: number;
};

const parseNumeric = (value: string): number => {
  const parsed = Number.parseFloat(value.replace(/[^0-9.-]/g, ""));
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return parsed;
};

const toComparisonRows = (comparison?: SalesV2Comparison): ChartRow[] => {
  if (!comparison) {
    return [];
  }
  return comparison.metrics
    .map((metric) => ({
      label: metric.label,
      storeValue: parseNumeric(metric.storeValue),
      peerValue: parseNumeric(metric.peerValue),
    }))
    .filter((item) => item.storeValue > 0 || item.peerValue > 0)
    .slice(0, 4);
};

const toVisualRows = (visualData?: SalesVisualData | null): ChartRow[] => {
  if (!visualData) {
    return [];
  }

  if (Array.isArray(visualData.labels) && Array.isArray(visualData.datasets) && visualData.datasets.length >= 2) {
    const storeDataset = visualData.datasets[0];
    const peerDataset = visualData.datasets[1];
    return visualData.labels
      .map((label, index) => ({
        label,
        storeValue: Number(storeDataset.data[index] ?? 0),
        peerValue: Number(peerDataset.data[index] ?? 0),
      }))
      .filter((item) => item.storeValue > 0 || item.peerValue > 0)
      .slice(0, 4);
  }

  if (visualData.channel_analysis) {
    const onlineAmt = Number(visualData.channel_analysis.online_amt ?? 0);
    const offlineAmt = Number(visualData.channel_analysis.offline_amt ?? 0);
    if (onlineAmt > 0 || offlineAmt > 0) {
      return [
        {
          label: "채널 매출",
          storeValue: onlineAmt,
          peerValue: offlineAmt,
        },
      ];
    }
  }

  return [];
};

export const SalesV2QueryDataChart = ({
  comparison,
  visualData,
}: {
  comparison?: SalesV2Comparison;
  visualData?: SalesVisualData | null;
}) => {
  const rows = toVisualRows(visualData);
  const chartRows = rows.length > 0 ? rows : toComparisonRows(comparison);
  if (chartRows.length === 0) {
    return null;
  }

  const maxValue = Math.max(1, ...chartRows.map((item) => Math.max(item.storeValue, item.peerValue)));

  return (
    <div className="rounded-2xl border border-[#dce4f3] bg-white px-4 py-3">
      <p className="text-xs font-semibold text-slate-700">질의 근거 데이터 차트</p>
      <div className="mt-3 space-y-2">
        {chartRows.map((item) => {
          const storeWidth = Math.max(6, Math.round((item.storeValue / maxValue) * 100));
          const peerWidth = Math.max(6, Math.round((item.peerValue / maxValue) * 100));
          return (
            <div key={item.label} className="space-y-1">
              <p className="text-[11px] font-semibold text-slate-600">{item.label}</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-8 text-[10px] font-semibold text-[#2454C8]">매장</span>
                  <div className="h-2 flex-1 rounded-full bg-[#eef4ff]">
                    <div className="h-2 rounded-full bg-[#2454C8]" style={{ width: `${storeWidth}%` }} />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">{Math.round(item.storeValue).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-8 text-[10px] font-semibold text-slate-500">비교</span>
                  <div className="h-2 flex-1 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-slate-400" style={{ width: `${peerWidth}%` }} />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">{Math.round(item.peerValue).toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
