import type { TileArgs } from "react-calendar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import donutBrown from "@/assets/donut-brown.svg";
import donutPink from "@/assets/donut-pink.svg";
import type { ScheduleEvent } from "@/features/dashboard/types/dashboard";
import { hasEventOnDate } from "@/features/dashboard/utils/schedule-panel";

export function DashboardScheduleCalendar({
  selectedDate,
  events,
  onChangeDate,
}: {
  selectedDate: Date;
  events: ScheduleEvent[];
  onChangeDate: (date: Date) => void;
}) {
  const tileClassName = ({ date, view }: TileArgs) => {
    if (view !== "month") return undefined;

    const classNames: string[] = [];

    if (date.getDay() === 0) classNames.push("text-red-500");
    if (date.getDay() === 6) classNames.push("text-blue-500");

    if (hasEventOnDate(events, date)) {
      classNames.push(
        "relative after:absolute after:bottom-1.5 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-[#2454C8]",
      );
    }

    return classNames.length > 0 ? classNames.join(" ") : undefined;
  };

  return (
    <div className="lg:col-span-1">
      <div
        className="[&_.react-calendar]:w-full [&_.react-calendar]:border-0 [&_.react-calendar]:bg-transparent [&_.react-calendar__navigation__label]:font-semibold [&_.react-calendar__tile--now]:rounded-xl [&_.react-calendar__tile--now]:bg-[#edf4ff] [&_.react-calendar__month-view__weekdays]:text-[11px] [&_.react-calendar__month-view__weekdays]:font-semibold [&_.react-calendar__month-view__weekdays]:text-slate-400"
        style={{
          ["--calendar-active-date-bg" as string]: `url("${donutPink}")`,
          ["--calendar-today-date-bg" as string]: `url("${donutBrown}")`,
        }}
      >
        <Calendar
          value={selectedDate}
          locale="ko-KR"
          onChange={(value) => {
            if (value instanceof Date) {
              onChangeDate(value);
            }
          }}
          calendarType="gregory"
          tileClassName={tileClassName}
          formatDay={(_locale, date) => date.toLocaleString("en", { day: "numeric" })}
        />
      </div>
    </div>
  );
}
