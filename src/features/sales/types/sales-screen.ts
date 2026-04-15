export type SalesTabKey = "profit" | "breakdown" | "products" | "query";

export type SalesQueryHistoryItem = {
  query: string;
  answer: string;
  insights: string[];
  storeContext: string;
  dataSource: string;
  comparisonBasis: string;
  calculationDate: string;
};

export type SalesWeeklyDataItem = {
  day: string;
  revenue: number;
  profit: number;
  cost: number;
};

export type SalesProductDataItem = {
  name: string;
  sales: number;
  profit: number;
  profitRate: number;
};
