import type { ProductionAlertItem, ProductionSkuItem } from "@/features/production/types/production";
import type { AlertSeverity, GroupedAlertRow, GroupedAlertSection } from "@/features/production/types/production-alerts";
import { severityDescriptionMap } from "@/features/production/data/production-alerts";

const depletionSortValue = (sku?: ProductionSkuItem) =>
  sku && typeof sku.depletion_eta_minutes === "number" ? sku.depletion_eta_minutes : Number.POSITIVE_INFINITY;

const depletionLabel = (alert: ProductionAlertItem, sku?: ProductionSkuItem) => {
  if (alert.expected_at) return alert.expected_at;
  if (sku?.predicted_stockout_time) return sku.predicted_stockout_time;
  if (typeof sku?.depletion_eta_minutes === "number") return `약 ${sku.depletion_eta_minutes}분 후`;
  return "-";
};

const buildRows = (severity: AlertSeverity, alerts: ProductionAlertItem[], items: ProductionSkuItem[]): GroupedAlertRow[] => {
  const skuMap = new Map(items.map((item) => [item.sku_id, item] as const));
  const byKey = new Map<string, { sku?: ProductionSkuItem; row: GroupedAlertRow }>();

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
            skuName: sku?.sku_name ?? alert.title,
            currentStock: sku ? `${sku.current_stock}개` : "-",
            depletionTime: depletionLabel(alert, sku),
          },
        });
        return;
      }

      const current = byKey.get(rowKey);
      if (!current) return;
      if (current.row.depletionTime === "-") {
        current.row.depletionTime = depletionLabel(alert, sku);
      }
    });

  return [...byKey.values()]
    .sort((a, b) => depletionSortValue(a.sku) - depletionSortValue(b.sku))
    .map((entry) => entry.row);
};

export const buildGroupedAlertSections = (
  alerts: ProductionAlertItem[],
  items: ProductionSkuItem[],
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
          ? `${rows[0]?.skuName ?? "위험 품목"} 외 ${Math.max(rows.length - 1, 0)}개 품목`
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
