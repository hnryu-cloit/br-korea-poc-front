export type SalesSignal = {
  id: string;
  title: string;
  metric: string;
  value: string;
  change: string;
  trend: "up" | "down" | "flat";
  priority: "high" | "medium" | "low";
  region: string;
  insight: string;
};

export type SignalsResponse = {
  items: SalesSignal[];
  high_count: number;
};
