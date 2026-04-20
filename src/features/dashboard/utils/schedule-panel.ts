import type { ScheduleEvent } from "@/features/dashboard/types/schedule";

export function formatScheduleDate(yyyymmdd: string): string {
  if (yyyymmdd.length !== 8) return yyyymmdd;
  return `${yyyymmdd.slice(4, 6)}/${yyyymmdd.slice(6, 8)}`;
}

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

export function getScheduleDDayLabel(yyyymmdd: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(
    Number(yyyymmdd.slice(0, 4)),
    Number(yyyymmdd.slice(4, 6)) - 1,
    Number(yyyymmdd.slice(6, 8)),
  );
  target.setHours(0, 0, 0, 0);

  const diff = Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
  if (diff === 0) return "오늘";
  if (diff < 0) return "진행중";
  return `D-${diff}`;
}

export function hasEventOnDate(events: ScheduleEvent[], date: Date): boolean {
  const key = formatCalendarDate(date);
  return events.some((event) => event.date === key);
}

export function selectEventsByDate(
  events: ScheduleEvent[],
  date: Date,
  limit = 8,
): ScheduleEvent[] {
  const key = formatCalendarDate(date);
  return events.filter((event) => event.date === key).slice(0, limit);
}
