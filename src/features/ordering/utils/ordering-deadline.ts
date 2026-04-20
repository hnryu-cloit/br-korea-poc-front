import { ORDERING_DEADLINE_URGENT_THRESHOLD_MS } from "@/features/ordering/constants/ordering-deadline";
import type { OrderingDeadlineItem } from "@/features/ordering/types/ordering";

export interface OrderingDeadlineGroup {
  deadlineAt: string;
  remainingText: string;
  isClosed: boolean;
  isUrgent: boolean;
  isOrderCompleted: boolean;
  primarySkuName: string;
  extraItemCount: number;
  items: OrderingDeadlineItem[];
}

const DEADLINE_TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

function toDeadlineDate(deadlineAt: string, now: Date): Date | null {
  const match = DEADLINE_TIME_REGEX.exec(deadlineAt);
  if (!match) return null;
  const hour = Number.parseInt(match[1], 10);
  const minute = Number.parseInt(match[2], 10);
  const date = new Date(now);
  date.setHours(hour, minute, 0, 0);
  return date;
}

function formatRemainingTime(remainingMs: number): string {
  const safeMs = Math.max(remainingMs, 0);
  const totalSeconds = Math.floor(safeMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
    seconds,
  ).padStart(2, "0")}`;
}

export function buildOrderingDeadlineGroups(
  items: OrderingDeadlineItem[],
  now: Date,
): OrderingDeadlineGroup[] {
  const grouped = new Map<string, OrderingDeadlineItem[]>();

  items.forEach((item) => {
    const current = grouped.get(item.deadline_at) ?? [];
    current.push(item);
    grouped.set(item.deadline_at, current);
  });

  return Array.from(grouped.entries())
    .map(([deadlineAt, groupItems]) => {
      const deadlineDate = toDeadlineDate(deadlineAt, now);
      const remainingMs = deadlineDate ? deadlineDate.getTime() - now.getTime() : 0;
      const primarySkuName = groupItems[0]?.sku_name ?? "-";
      return {
        deadlineAt,
        remainingText: formatRemainingTime(remainingMs),
        isClosed: remainingMs <= 0,
        isUrgent: remainingMs > 0 && remainingMs <= ORDERING_DEADLINE_URGENT_THRESHOLD_MS,
        isOrderCompleted: groupItems.every((item) => item.is_ordered),
        primarySkuName,
        extraItemCount: Math.max(groupItems.length - 1, 0),
        items: groupItems,
      };
    })
    .sort((a, b) => a.deadlineAt.localeCompare(b.deadlineAt));
}
