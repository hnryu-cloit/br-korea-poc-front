import type { SalesTabKey } from "@/features/sales/types/sales-screen";

export const salesTabs: { key: SalesTabKey; label: string }[] = [
  { key: "profit", label: "순이익 분석" },
  { key: "breakdown", label: "비용 구성" },
  { key: "products", label: "상품별 분석" },
  { key: "query", label: "AI 질의" },
];
