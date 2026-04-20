export const ORDERING_DEADLINE_TICK_INTERVAL_MS = 1000;
export const ORDERING_DEADLINE_URGENT_THRESHOLD_MS = 60 * 60 * 1000;
export const ORDERING_DEADLINE_TABLE_HEADERS = [
  "주문 마감 시간",
  "남은 시간",
  "주문 품목",
  "마감 여부",
  "주문완료 여부",
] as const;
