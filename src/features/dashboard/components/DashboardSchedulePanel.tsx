import { useState } from "react";

import { DashboardScheduleCalendar } from "@/features/dashboard/components/DashboardScheduleCalendar";
import { DashboardScheduleContent } from "@/features/dashboard/components/DashboardScheduleContent";
import {
  SCHEDULE_MAX_VISIBLE_EVENTS,
  SCHEDULE_MAX_VISIBLE_TODOS,
  type SchedulePanelTab,
} from "@/features/dashboard/constants/schedule-panel";
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
  const [activeTab, setActiveTab] = useState<SchedulePanelTab>("todo");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { todos: resolvedTodos, toggleTodo } = useDashboardTodos(storeId, todos);
  const visibleTodos = resolvedTodos.slice(0, SCHEDULE_MAX_VISIBLE_TODOS);
  const hiddenTodoCount = Math.max(resolvedTodos.length - SCHEDULE_MAX_VISIBLE_TODOS, 0);
  const eventSummary = getEventSummary(events, selectedDate, SCHEDULE_MAX_VISIBLE_EVENTS);

  return (
    <section className="h-[350px] overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="grid h-full gap-6 p-6 lg:grid-cols-3">
        <DashboardScheduleCalendar
          selectedDate={selectedDate}
          events={events}
          onChangeDate={setSelectedDate}
        />
        <DashboardScheduleContent
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          todos={visibleTodos}
          toggleTodo={toggleTodo}
          hiddenTodoCount={hiddenTodoCount}
          scheduleEvents={eventSummary.visibleEvents}
          hiddenEventCount={eventSummary.hiddenCount}
          isLoading={isLoading}
          onClickTodoMore={() => window.alert("준비중입니다")}
          onClickEventMore={() => window.alert("준비중입니다")}
        />
      </div>
    </section>
  );
}
