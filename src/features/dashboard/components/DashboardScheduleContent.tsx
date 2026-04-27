import { CheckCircle2, Circle } from "lucide-react";

import {
  SCHEDULE_PANEL_TAB_LABELS,
  SCHEDULE_EVENT_STATUS_LABEL,
  SCHEDULE_EVENT_STATUS_STYLE,
  SCHEDULE_EVENT_TYPE_LABEL,
  SCHEDULE_EVENT_TYPE_STYLE,
  type SchedulePanelTab,
} from "@/features/dashboard/constants/schedule-panel";
import type { DashboardTodoItem } from "@/features/dashboard/types/dashboard";
import type { ScheduleEventSummaryItem } from "@/features/dashboard/utils/schedule-panel";

export function DashboardScheduleContent({
  activeTab,
  onChangeTab,
  incompleteTodos,
  completedTodos,
  toggleTodo,
  scheduleEvents,
  isLoading,
}: {
  activeTab: SchedulePanelTab;
  onChangeTab: (tab: SchedulePanelTab) => void;
  incompleteTodos: DashboardTodoItem[];
  completedTodos: DashboardTodoItem[];
  toggleTodo: (id: string) => void;
  scheduleEvents: ScheduleEventSummaryItem[];
  isLoading: boolean;
}) {
  const visibleTodos = activeTab === "pending" ? incompleteTodos : completedTodos;
  const pendingCount = incompleteTodos.length;
  const completedCount = completedTodos.length;
  const scheduleCount = scheduleEvents.length;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden lg:col-span-2">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#FAF4F2CC]">
        <div className="overflow-x-auto border-b border-[rgba(99,107,116,0.3)]">
          <div className="flex min-w-max items-stretch">
            <TodoTab
              isActive={activeTab === "pending"}
              label={SCHEDULE_PANEL_TAB_LABELS.pending}
              count={pendingCount}
              onClick={() => onChangeTab("pending")}
            />
            <TodoTab
              isActive={activeTab === "schedule"}
              label={SCHEDULE_PANEL_TAB_LABELS.schedule}
              count={scheduleCount}
              onClick={() => onChangeTab("schedule")}
            />
            <TodoTab
              isActive={activeTab === "completed"}
              label={SCHEDULE_PANEL_TAB_LABELS.completed}
              count={completedCount}
              onClick={() => onChangeTab("completed")}
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-[12px_20px]">
          {activeTab === "schedule" ? (
            isLoading ? (
              <p className="text-sm text-slate-400">일정 불러오는 중...</p>
            ) : scheduleEvents.length === 0 ? (
              <p className="mt-2 text-sm text-[#8A7A73]">선택한 날짜에 주요 일정이 없습니다.</p>
            ) : (
              <ul className="flex flex-col gap-1">
                {scheduleEvents.map((event) => (
                  <li
                    key={event.id}
                    className="flex items-start gap-3 rounded-2xl border border-border/40 px-4 py-3 bg-white"
                  >
                    <div className="shrink-0 pt-0.5">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${SCHEDULE_EVENT_TYPE_STYLE[event.category] ?? SCHEDULE_EVENT_TYPE_STYLE.notice}`}
                      >
                        {SCHEDULE_EVENT_TYPE_LABEL[event.category] ?? event.category}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">{event.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{event.periodText}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-bold text-[#2454C8]">{event.dDayText}</p>
                      <span
                        className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${SCHEDULE_EVENT_STATUS_STYLE[event.status]}`}
                      >
                        {SCHEDULE_EVENT_STATUS_LABEL[event.status]}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )
          ) : (
            <>
              <ul className="flex flex-col">
                {visibleTodos.map((todo) => (
                  <li key={todo.id}>
                    <button
                      type="button"
                      onClick={() => toggleTodo(todo.id)}
                      className={`flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors ${
                        todo.done
                          ? "border-[#E9D6CE] hover:bg-[#FFF1EA]"
                          : "border-[#E9D6CE] hover:bg-[#FFD9C7]/50"
                      }`}
                    >
                      {todo.done ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#B34816]" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0 text-[#D7B7A9]" />
                      )}
                      <span
                        className={`text-base ${
                          todo.done ? "text-[#9F8D86] line-through" : "font-medium text-[#3E342F]"
                        }`}
                      >
                        {todo.label}
                      </span>
                      {todo.recurring && !todo.done ? (
                        <span className="ml-auto shrink-0 text-sm font-bold text-orange-500">
                          반복하기
                        </span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
              {visibleTodos.length === 0 ? (
                <p className="mt-2 text-sm text-[#8A7A73]">
                  {activeTab === "pending"
                    ? "선택한 날짜에 완료되지 않은 할 일이 없습니다."
                    : "선택한 날짜에 완료된 할 일이 없습니다."}
                </p>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TodoTab({
  isActive,
  label,
  count,
  onClick,
}: {
  isActive: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-10 items-center gap-1 px-4 pb-1 pt-1 text-base font-bold whitespace-nowrap transition-colors ${
        isActive
          ? "text-[#B34816] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[#B34816]"
          : "text-[#1D293D] hover:text-[#B34816]"
      }`}
    >
      <span>{label}</span>
      <span
        className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-[7px] text-sm leading-none ${
          isActive ? "bg-[#FFB38FB3] text-[#653818]" : "bg-[#E2E8F0] text-[#6B6B6B]"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
