import type { SalesQueryResponse } from "@/features/sales/types/sales";

export type SalesV2Comparison = {
  store: string;
  peerGroup: string;
  summary: string;
  metrics: { label: string; storeValue: string; peerValue: string }[];
};

export type SalesV2Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
  evidence?: string[];
  actions?: string[];
  comparison?: SalesV2Comparison;
  queryType?: string | null;
  processingRoute?: string | null;
  blocked?: boolean;
};

export type SalesV2HintItem = {
  q: string;
  a: string;
};

export type SalesV2QueryResponseComparison = SalesQueryResponse["comparison"];
