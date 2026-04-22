import { useState } from "react";

import { DashboardScheduleCalendar } from "@/features/dashboard/components/DashboardScheduleCalendar";
import { DashboardScheduleContent } from "@/features/dashboard/components/DashboardScheduleContent";
import { type SchedulePanelTab } from "@/features/dashboard/constants/schedule-panel";
import { useDashboardTodos } from "@/features/dashboard/hooks/useDashboardTodos";
import type { ScheduleEvent, ScheduleTodoItem } from "@/features/dashboard/types/dashboard";
import { getEventSummary } from "@/features/dashboard/utils/schedule-panel";

export function DashboardSchedulePanel({
  storeId,
  events,
  todos,
  isLoading,
}: {
  storeId?: string;
  events: ScheduleEvent[];
  todos: ScheduleTodoItem[];
  updatedAt?: string;
  isLoading: boolean;
}) {
  const [activeTab, setActiveTab] = useState<SchedulePanelTab>("pending");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { todos: resolvedTodos, toggleTodo } = useDashboardTodos(storeId, selectedDate, todos);
  const incompleteTodos = resolvedTodos.filter((todo) => !todo.done);
  const completedTodos = resolvedTodos.filter((todo) => todo.done);
  const eventSummary = getEventSummary(events, selectedDate);

  return (
    <section className="flex h-[430px] min-h-[430px] max-h-[430px] flex-col gap-[8px] overflow-hidden bg-white p-[24px_48px]">
      <span className="text-lg text-brown-700 font-bold">나의 할 일</span>
      <div className="grid min-h-0 flex-1 items-stretch gap-6 lg:grid-cols-3">
        <DashboardScheduleCalendar
          selectedDate={selectedDate}
          events={events}
          onChangeDate={setSelectedDate}
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
