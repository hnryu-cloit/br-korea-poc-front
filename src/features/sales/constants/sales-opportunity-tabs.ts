import type { SalesOpportunityTabKey } from "@/features/sales/types/sales-opportunity";

export const SALES_OPPORTUNITY_DEFAULT_TAB: SalesOpportunityTabKey = "marketing_roi";

export const SALES_OPPORTUNITY_TABS: { key: SalesOpportunityTabKey; label: string }[] = [
  { key: "marketing_roi", label: "마케팅 성과/ROI" },
  { key: "channel_payment", label: "채널·결제 최적화" },
  { key: "promotion_efficiency", label: "프로모션·제휴 효율" },
  { key: "store_benchmark", label: "매장 간 벤치마킹" },
];

export const isSalesOpportunityTabKey = (value: string | null): value is SalesOpportunityTabKey => {
  if (!value) return false;
  return SALES_OPPORTUNITY_TABS.some((tab) => tab.key === value);
};
