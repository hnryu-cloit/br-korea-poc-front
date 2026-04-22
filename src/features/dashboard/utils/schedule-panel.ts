import {
  SCHEDULE_ENDING_SOON_THRESHOLD_DAYS,
  SCHEDULE_EVENT_STATUS_PRIORITY,
  type ScheduleEventStatus,
} from "@/features/dashboard/constants/schedule-panel";
import type {
  DashboardTodoItem,
  ScheduleEvent,
  ScheduleTodoItem,
} from "@/features/dashboard/types/dashboard";

type EventDateRange = {
  startDate: Date;
  endDate: Date;
};

export type ScheduleEventSummaryItem = {
  id: string;
  title: string;
  category: ScheduleEvent["category"];
  type: string;
  periodText: string;
  dDayText: string;
  status: ScheduleEventStatus;
};

export function formatCalendarDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

export function formatKoreanDate(date: Date): string {
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

export function formatSelectedDateHeadline(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day} 기준`;
}

export function formatScheduleDate(yyyymmdd: string): string {
  if (yyyymmdd.length !== 8) return yyyymmdd;
  return `${yyyymmdd.slice(4, 6)}/${yyyymmdd.slice(6, 8)}`;
}

function parseCompactDate(yyyymmdd: string): Date {
  const normalized = yyyymmdd.replace(/\D/g, "");
  if (normalized.length !== 8) {
    const fallback = new Date(yyyymmdd);
    fallback.setHours(0, 0, 0, 0);
    return fallback;
  }

  const year = Number(normalized.slice(0, 4));
  const month = Number(normalized.slice(4, 6)) - 1;
  const day = Number(normalized.slice(6, 8));
  const date = new Date(year, month, day);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatCompactDate(yyyymmdd: string): string {
  const normalized = yyyymmdd.replace(/\D/g, "");
  if (normalized.length !== 8) return yyyymmdd;
  return `${normalized.slice(0, 4)}.${normalized.slice(4, 6)}.${normalized.slice(6, 8)}`;
}

function toEventDateRange(event: ScheduleEvent): EventDateRange {
  const source = event as unknown as {
    start_date?: string;
    end_date?: string;
    startDate?: string;
    endDate?: string;
  };

  const startRaw = source.start_date ?? source.startDate ?? event.date;
  const endRaw = source.end_date ?? source.endDate ?? event.date;
  return {
    startDate: parseCompactDate(startRaw),
    endDate: parseCompactDate(endRaw),
  };
}

function calculateDayDiff(baseDate: Date, targetDate: Date): number {
  return Math.ceil((targetDate.getTime() - baseDate.getTime()) / 86_400_000);
}

export function getScheduleDDayLabel(yyyymmdd: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = parseCompactDate(yyyymmdd);

  const diff = calculateDayDiff(today, targetDate);
  if (diff === 0) return "오늘";
  if (diff < 0) return "진행중";
  return `D-${diff}`;
}

function resolveEventStatus(selectedDate: Date, range: EventDateRange): ScheduleEventStatus | null {
  if (selectedDate > range.endDate) return null;
  if (selectedDate < range.startDate) return "upcoming";

  const daysToEnd = calculateDayDiff(selectedDate, range.endDate);
  if (daysToEnd <= SCHEDULE_ENDING_SOON_THRESHOLD_DAYS) return "ending_soon";
  return "in_progress";
}

function buildDDayText(
  status: ScheduleEventStatus,
  selectedDate: Date,
  range: EventDateRange,
): string {
  if (status === "upcoming") {
    const diff = calculateDayDiff(selectedDate, range.startDate);
    return diff === 0 ? "시작 D-day" : `시작 D-${diff}`;
  }

  const diff = calculateDayDiff(selectedDate, range.endDate);
  return diff === 0 ? "종료 D-day" : `종료 D-${diff}`;
}

function buildPeriodText(event: ScheduleEvent): string {
  const source = event as unknown as {
    start_date?: string;
    end_date?: string;
    startDate?: string;
    endDate?: string;
  };
  const startRaw = source.start_date ?? source.startDate ?? event.date;
  const endRaw = source.end_date ?? source.endDate ?? event.date;

  if (startRaw === endRaw) {
    return formatCompactDate(startRaw);
  }
  return `${formatCompactDate(startRaw)} - ${formatCompactDate(endRaw)}`;
}

export function hasEventOnDate(events: ScheduleEvent[], date: Date): boolean {
  const selectedKey = formatCalendarDate(date);
  return events.some((event) => {
    const range = toEventDateRange(event);
    const startKey = formatCalendarDate(range.startDate);
    const endKey = formatCalendarDate(range.endDate);
    return selectedKey >= startKey && selectedKey <= endKey;
  });
}

export function selectEventsByDate(
  events: ScheduleEvent[],
  date: Date,
  limit = 8,
): ScheduleEvent[] {
  const selectedKey = formatCalendarDate(date);
  return events.filter((event) => event.date === selectedKey).slice(0, limit);
}

export function getTodoSummary<T extends ScheduleTodoItem | DashboardTodoItem>(
  todos: T[],
  maxVisible: number,
) {
  return {
    visibleTodos: todos.slice(0, maxVisible),
    hiddenCount: Math.max(todos.length - maxVisible, 0),
    totalCount: todos.length,
  };
}

export function getEventSummary(events: ScheduleEvent[], selectedDate: Date, maxVisible?: number) {
  const withStatus = events
    .map((event) => {
      const range = toEventDateRange(event);
      const status = resolveEventStatus(selectedDate, range);
      if (!status) return null;

      return {
        id: `${event.date}-${event.category}-${event.title}`,
        title: event.title,
        category: event.category,
        type: event.type,
        status,
        periodText: buildPeriodText(event),
        dDayText: buildDDayText(status, selectedDate, range),
        sortKey: calculateDayDiff(
          selectedDate,
          status === "upcoming" ? range.startDate : range.endDate,
        ),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => {
      const priorityDiff =
        SCHEDULE_EVENT_STATUS_PRIORITY[a.status] - SCHEDULE_EVENT_STATUS_PRIORITY[b.status];
      if (priorityDiff !== 0) return priorityDiff;
      return a.sortKey - b.sortKey;
    });

  const normalized: ScheduleEventSummaryItem[] = withStatus.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    type: item.type,
    status: item.status,
    periodText: item.periodText,
    dDayText: item.dDayText,
  }));

  return {
    visibleEvents: typeof maxVisible === "number" ? normalized.slice(0, maxVisible) : normalized,
    hiddenCount: typeof maxVisible === "number" ? Math.max(normalized.length - maxVisible, 0) : 0,
    totalCount: normalized.length,
  };
}
