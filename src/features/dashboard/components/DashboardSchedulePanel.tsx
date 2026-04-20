import { useState } from "react";

import { type SchedulePanelTab } from "@/features/dashboard/constants/schedule-panel";
import { DashboardScheduleCalendar } from "@/features/dashboard/components/DashboardScheduleCalendar";
import { DashboardScheduleContent } from "@/features/dashboard/components/DashboardScheduleContent";
import { useDashboardTodos } from "@/features/dashboard/hooks/useDashboardTodos";
import type { ScheduleEvent, ScheduleTodoItem } from "@/features/dashboard/types/schedule";
import { selectEventsByDate } from "@/features/dashboard/utils/schedule-panel";

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
  const [activeTab, setActiveTab] = useState<SchedulePanelTab>("todo");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { todos: resolvedTodos, toggleTodo, completedCount } = useDashboardTodos(storeId, todos);

  const selectedDateEvents = selectEventsByDate(events, selectedDate, 8);

  return (
    <section className="overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="grid gap-6 p-6 lg:grid-cols-3">
        <DashboardScheduleCalendar
          selectedDate={selectedDate}
          events={events}
          onChangeDate={setSelectedDate}
        />
        <DashboardScheduleContent
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          todos={resolvedTodos}
          toggleTodo={toggleTodo}
          completedCount={completedCount}
          scheduleEvents={selectedDateEvents}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}
