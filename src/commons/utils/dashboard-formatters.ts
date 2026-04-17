export type DashboardValueUnit = "count" | "minutes";
export type DashboardStatKey =
  | "production_risk_count"
  | "ordering_deadline_minutes"
  | "today_profit_estimate"
  | "alert_count";

export const formatDashboardValueWithUnit = (
  value: number | string,
  unit?: DashboardValueUnit,
) => {
  if (typeof value === "number") {
    if (unit === "count") return `${value}개`;
    if (unit === "minutes") return `${value}분`;
  }
  return String(value);
};

export const formatDashboardStatValue = (params: {
  key: DashboardStatKey;
  value: number | string;
  unit?: DashboardValueUnit;
}) => {
  const { key, value, unit } = params;
  if (key === "today_profit_estimate" && typeof value === "string") {
    if (value === "risk") return "위험 있음";
    if (value === "stable") return "안정";
  }
  return formatDashboardValueWithUnit(value, unit);
};

export const parseDashboardHighlight = (
  text: string,
): { title: string; detail?: string } => {
  const byDot = text.split("·").map((item) => item.trim()).filter(Boolean);
  if (byDot.length > 1) {
    return { title: byDot[0], detail: byDot.slice(1).join(" · ") };
  }
  const byColon = text.split(":").map((item) => item.trim()).filter(Boolean);
  if (byColon.length > 1) {
    return { title: byColon[0], detail: byColon.slice(1).join(": ") };
  }
  return { title: text };
};
