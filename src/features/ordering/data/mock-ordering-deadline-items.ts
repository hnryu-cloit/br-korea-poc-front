import type { OrderingDeadlineItem } from "@/features/ordering/types/ordering";

export const MOCK_ORDERING_DEADLINE_ITEMS: OrderingDeadlineItem[] = [
  { id: "ord-1", sku_name: "아메리카노", deadline_at: "21:45", is_ordered: true },
  { id: "ord-2", sku_name: "바닐라 라떼", deadline_at: "21:50", is_ordered: false },
  { id: "ord-3", sku_name: "핫초코", deadline_at: "21:51", is_ordered: true },
  { id: "ord-4", sku_name: "딸기 케이크", deadline_at: "21:54", is_ordered: false },
  { id: "ord-5", sku_name: "초코 케이크", deadline_at: "22:23", is_ordered: false },
];

export const MOCK_ORDERING_DEADLINE_TIMES = Array.from(
  new Set(MOCK_ORDERING_DEADLINE_ITEMS.map((item) => item.deadline_at)),
).sort((a, b) => a.localeCompare(b));
