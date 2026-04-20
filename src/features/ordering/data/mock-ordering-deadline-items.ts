import type { OrderingDeadlineItem } from "@/features/ordering/types/ordering";

export const MOCK_ORDERING_DEADLINE_ITEMS: OrderingDeadlineItem[] = [
  { id: "ord-1", sku_name: "아메리카노", deadline_at: "09:30", is_ordered: true },
  { id: "ord-2", sku_name: "카페라떼", deadline_at: "09:30", is_ordered: true },
  { id: "ord-3", sku_name: "초코 도넛", deadline_at: "09:30", is_ordered: true },
  { id: "ord-4", sku_name: "딸기 케이크", deadline_at: "20:00", is_ordered: false },
  { id: "ord-5", sku_name: "치즈 베이글", deadline_at: "20:00", is_ordered: false },
  { id: "ord-6", sku_name: "핫초코", deadline_at: "19:00", is_ordered: true },
  { id: "ord-7", sku_name: "바닐라 라떼", deadline_at: "18:10", is_ordered: false },
];
