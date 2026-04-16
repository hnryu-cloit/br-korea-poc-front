import type { ProductionAlertItem, ProductionOverviewAlertItem } from "@/features/production/types/production";
import type { AlertSeverity, GroupedAlertRow, GroupedAlertSection } from "@/features/production/types/production-alerts";
import { severityDescriptionMap } from "@/features/production/data/production-alerts";
import { formatCountWithUnit } from "@/commons/utils/format-count";

const parseDepletionMinutes = (value?: string): number | null => {
  if (!value) return null;

  const onlyNumberPattern = /^\d+$/;
  if (onlyNumberPattern.test(value)) {
    return Number(value);
  }

  const hhmmPattern = /^(\d{1,2}):([0-5]\d)$/;
  const hhmmMatch = value.match(hhmmPattern);
  if (hhmmMatch) {
    const hours = Number(hhmmMatch[1]);
    const minutes = Number(hhmmMatch[2]);
    return (hours * 60) + minutes;
  }

  return null;
};

const depletionSortValue = (sku?: ProductionOverviewAlertItem) =>
  parseDepletionMinutes(sku?.depletion_time) ?? Number.POSITIVE_INFINITY;

const depletionLabel = (sku?: ProductionOverviewAlertItem) => {
  const totalMinutes = parseDepletionMinutes(sku?.depletion_time);
  if (totalMinutes === null) return "-";

  if (totalMinutes === 0) return "곧 소진";

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `약 ${minutes}분 후`;
  if (minutes === 0) return `약 ${hours}시간 후`;
  return `약 ${hours}시간 ${minutes}분 후`;
};

const buildRows = (severity: AlertSeverity, alerts: ProductionAlertItem[], items: ProductionOverviewAlertItem[]): GroupedAlertRow[] => {
  const skuMap = new Map(items.map((item) => [item.sku_id, item] as const));
  const byKey = new Map<string, { sku?: ProductionOverviewAlertItem; row: GroupedAlertRow }>();

  alerts
    .filter((alert) => alert.severity === severity)
    .forEach((alert) => {
      const sku = alert.sku_id ? skuMap.get(alert.sku_id) : undefined;
      const rowKey = sku?.sku_id ?? alert.id;
      if (!byKey.has(rowKey)) {
        byKey.set(rowKey, {
          sku,
          row: {
            key: rowKey,
            skuName: sku?.name ?? alert.title,
            currentStock: sku ? formatCountWithUnit(sku.current, "개") : "-",
            depletionTime: depletionLabel(sku),
          },
        });
        return;
      }

      const current = byKey.get(rowKey);
      if (!current) return;
      if (current.row.depletionTime === "-") {
        current.row.depletionTime = depletionLabel(sku);
      }
    });

  return [...byKey.values()]
    .sort((a, b) => depletionSortValue(a.sku) - depletionSortValue(b.sku))
    .map((entry) => entry.row);
};

export const buildGroupedAlertSections = (
  alerts: ProductionAlertItem[],
  items: ProductionOverviewAlertItem[],
): GroupedAlertSection[] => {
  return (["high", "medium"] as const)
    .map((severity) => {
      const severityAlerts = alerts.filter((alert) => alert.severity === severity);
      const rows = buildRows(severity, alerts, items);
      const count = severityAlerts.length;
      const representativeNames = rows.slice(0, 2).map((row) => row.skuName);
      const earliestDepletion = rows.find((row) => row.depletionTime !== "-")?.depletionTime ?? "-";
      const representativeText =
        rows.length > 1
          ? `${rows[0]?.skuName ?? "위험 품목"} 외 ${formatCountWithUnit(Math.max(rows.length - 1, 0), "개")} 품목`
          : `${rows[0]?.skuName ?? "위험 품목"}`;

      return {
        severity,
        count,
        summary: `${representativeText} ${severityDescriptionMap[severity]}`,
        representativeNames,
        earliestDepletion,
        rows,
      } satisfies GroupedAlertSection;
    })
    .filter((section) => section.count > 0);
};
