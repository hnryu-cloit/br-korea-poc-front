import type { ProductionAlertItem, ProductionSkuItem } from "@/features/production/types/production";

export type AlertSeverity = ProductionAlertItem["severity"];

export type GroupedAlertRow = {
  key: string;
  skuName: string;
  currentStock: string;
  depletionTime: string;
};

export type GroupedAlertSection = {
  severity: AlertSeverity;
  count: number;
  summary: string;
  representativeNames: string[];
  earliestDepletion: string;
  rows: GroupedAlertRow[];
};

export type ProductionAlertGrouperInput = {
  alerts: ProductionAlertItem[];
  items: ProductionSkuItem[];
};
