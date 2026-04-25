import { useEffect, useState } from "react";

import { DashboardScheduleCalendar } from "@/features/dashboard/components/DashboardScheduleCalendar";
import { DashboardScheduleContent } from "@/features/dashboard/components/DashboardScheduleContent";
import { type SchedulePanelTab } from "@/features/dashboard/constants/schedule-panel";
import { useDashboardTodos } from "@/features/dashboard/hooks/useDashboardTodos";
import type { ScheduleEvent, ScheduleTodoItem } from "@/features/dashboard/types/dashboard";
import { getEventSummary } from "@/features/dashboard/utils/schedule-panel";

export function DashboardSchedulePanel({
  storeId,
  events,
  scheduleEvents,
  todos,
  referenceDate,
  selectedDate,
  isLoading,
}: {
  storeId?: string;
  events: ScheduleEvent[];
  scheduleEvents?: ScheduleEvent[];
  todos: ScheduleTodoItem[];
  referenceDate?: Date;
  selectedDate?: Date;
  updatedAt?: string;
  isLoading: boolean;
}) {
  const [activeTab, setActiveTab] = useState<SchedulePanelTab>("pending");
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate ?? new Date());
  useEffect(() => {
    setCurrentDate(selectedDate ?? new Date());
  }, [selectedDate]);
  const { todos: resolvedTodos, toggleTodo } = useDashboardTodos(storeId, currentDate, todos);
  const incompleteTodos = resolvedTodos.filter((todo) => !todo.done);
  const completedTodos = resolvedTodos.filter((todo) => todo.done);
  const eventSummary = getEventSummary(scheduleEvents ?? events, currentDate);

  return (
    <section className="flex h-[430px] min-h-[430px] max-h-[430px] flex-col gap-[8px] overflow-hidden bg-white p-[24px_48px]">
      <span className="text-lg text-brown-700 font-bold">나의 할 일</span>
      <div className="grid min-h-0 flex-1 items-stretch gap-6 lg:grid-cols-3">
        <DashboardScheduleCalendar
          referenceDate={referenceDate ?? currentDate}
          selectedDate={currentDate}
          events={events}
          onChangeDate={setCurrentDate}
        />
        <DashboardScheduleContent
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          incompleteTodos={incompleteTodos}
          completedTodos={completedTodos}
          toggleTodo={toggleTodo}
          scheduleEvents={eventSummary.visibleEvents}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}
