import {
  ORDERING_REMINDER_DEADLINE_TIME_REGEX,
  ORDERING_REMINDER_LEAD_MINUTES,
} from "@/features/ordering/constants/ordering-deadline-reminder";
import type {
  OrderingReminderEvent,
  OrderingReminderStorage,
} from "@/features/ordering/types/ordering-deadline-reminder";

export function parseOrderingReminderStorage(raw: string | null): OrderingReminderStorage {
  if (!raw) {
    return { shown: {}, confirmed: {} };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<OrderingReminderStorage>;
    return {
      shown: parsed.shown && typeof parsed.shown === "object" ? parsed.shown : {},
      confirmed: parsed.confirmed && typeof parsed.confirmed === "object" ? parsed.confirmed : {},
    };
  } catch {
    return { shown: {}, confirmed: {} };
  }
}

export function toOrderingDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function buildOrderingReminderEvents(
  deadlineTimes: string[],
  now: Date,
): OrderingReminderEvent[] {
  const deduped = Array.from(new Set(deadlineTimes.map((time) => time.trim())));
  const dayKey = toOrderingDateKey(now);

  return deduped
    .map((deadlineAt) => {
      const match = ORDERING_REMINDER_DEADLINE_TIME_REGEX.exec(deadlineAt);
      if (!match) return null;

      const hour = Number.parseInt(match[1], 10);
      const minute = Number.parseInt(match[2], 10);
      const deadlineDate = new Date(now);
      deadlineDate.setHours(hour, minute, 0, 0);

      const reminderDate = new Date(deadlineDate);
      reminderDate.setMinutes(reminderDate.getMinutes() - ORDERING_REMINDER_LEAD_MINUTES);

      return {
        key: `${dayKey}:${deadlineAt}`,
        deadlineAt,
        deadlineDate,
        reminderDate,
      };
    })
    .filter((event): event is OrderingReminderEvent => Boolean(event))
    .sort((a, b) => a.deadlineDate.getTime() - b.deadlineDate.getTime());
}

export function keepOnlyTodayReminderStorage(
  storage: OrderingReminderStorage,
  todayKey: string,
): OrderingReminderStorage {
  const filterByToday = (source: Record<string, number>) => {
    let changed = false;
    const next = Object.fromEntries(
      Object.entries(source).filter(([key]) => {
        const include = key.startsWith(`${todayKey}:`);
        if (!include) changed = true;
        return include;
      }),
    );
    return { next, changed };
  };

  const shownResult = filterByToday(storage.shown);
  const confirmedResult = filterByToday(storage.confirmed);
  if (!shownResult.changed && !confirmedResult.changed) {
    return storage;
  }

  return {
    shown: shownResult.next,
    confirmed: confirmedResult.next,
  };
}
