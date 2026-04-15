import type { AlertSeverity } from "@/features/production/types/production-alerts";

export const severityLabelMap: Record<AlertSeverity, string> = {
  high: "긴급",
  medium: "주의",
};

export const severitySummaryClassMap: Record<AlertSeverity, string> = {
  high: "border-red-200 bg-red-50 text-red-700",
  medium: "border-orange-200 bg-orange-50 text-orange-700",
};

export const severityDetailClassMap: Record<AlertSeverity, string> = {
  high: "border-red-100 bg-white",
  medium: "border-orange-100 bg-white",
};

export const severityDescriptionMap: Record<AlertSeverity, string> = {
  high: "추가 생산이 즉시 권장됩니다.",
  medium: "생산량 점검이 필요합니다.",
};
