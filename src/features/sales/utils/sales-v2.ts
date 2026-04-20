import type {
  SalesV2Comparison,
  SalesV2QueryResponseComparison,
} from "@/features/sales/types/sales-v2";

export const toSalesV2Comparison = (
  raw: SalesV2QueryResponseComparison,
): SalesV2Comparison | undefined => {
  if (!raw) return undefined;
  return {
    store: raw.store,
    peerGroup: raw.peer_group,
    summary: raw.summary,
    metrics: raw.metrics.map((item) => ({
      label: item.label,
      storeValue: item.store_value,
      peerValue: item.peer_value,
    })),
  };
};
