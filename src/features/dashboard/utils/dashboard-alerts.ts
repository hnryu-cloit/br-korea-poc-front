import type { DashboardOrderDeadline } from "@/features/dashboard/types/dashboard";
import type { OrderDeadlineDisplay } from "@/features/dashboard/types/summary-card";

function padTime(value: number) {
  return String(value).padStart(2, "0");
}

function formatTime(date: Date) {
  return `${padTime(date.getHours())}:${padTime(date.getMinutes())}`;
}

function buildRemainingTimeLabel(now: Date, deadline: Date) {
  const diffMinutes = Math.max(Math.ceil((deadline.getTime() - now.getTime()) / 60_000), 0);
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  if (hours === 0) return `${minutes}분 남음`;
  if (minutes === 0) return `${hours}시간 남음`;
  return `${hours}시간 ${minutes}분 남음`;
}

export function formatOrderDeadlineDisplay(
  orderDeadline: DashboardOrderDeadline | null,
  now = new Date(),
): OrderDeadlineDisplay | null {
  if (!orderDeadline) return null;

  const deadline = new Date(orderDeadline.deadline_at);

  return {
    ...orderDeadline,
    currentTimeLabel: formatTime(now),
    deadlineTimeLabel: formatTime(deadline),
    remainingTimeLabel: buildRemainingTimeLabel(now, deadline),
  };
}
