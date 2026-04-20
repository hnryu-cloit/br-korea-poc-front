import { CheckCircle2, Circle } from "lucide-react";

import {
  SCHEDULE_EVENT_STATUS_LABEL,
  SCHEDULE_EVENT_STATUS_STYLE,
  SCHEDULE_EVENT_TYPE_LABEL,
  SCHEDULE_EVENT_TYPE_STYLE,
  SCHEDULE_PANEL_TAB_LABELS,
  type SchedulePanelTab,
} from "@/features/dashboard/constants/schedule-panel";
import type { DashboardTodoItem } from "@/features/dashboard/types/todo";
import type { ScheduleEventSummaryItem } from "@/features/dashboard/utils/schedule-panel";

export function DashboardScheduleContent({
  activeTab,
  onChangeTab,
  todos,
  toggleTodo,
  hiddenTodoCount,
  scheduleEvents,
  hiddenEventCount,
  isLoading,
  onClickTodoMore,
  onClickEventMore,
}: {
  activeTab: SchedulePanelTab;
  onChangeTab: (tab: SchedulePanelTab) => void;
  todos: DashboardTodoItem[];
  toggleTodo: (id: string) => void;
  hiddenTodoCount: number;
  scheduleEvents: ScheduleEventSummaryItem[];
  hiddenEventCount: number;
  isLoading: boolean;
  onClickTodoMore: () => void;
  onClickEventMore: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col lg:col-span-2">
      <div className="mb-4 flex items-center gap-1">
        {(Object.keys(SCHEDULE_PANEL_TAB_LABELS) as SchedulePanelTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onChangeTab(tab)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === tab
                ? "bg-[#1f4dbb] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {SCHEDULE_PANEL_TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {activeTab === "todo" ? (
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li key={todo.id}>
                <button
                  type="button"
                  onClick={() => toggleTodo(todo.id)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-border/50 bg-[#f8fbff] px-4 py-3 text-left transition-colors hover:bg-[#eef4ff]"
                >
                  {todo.done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-slate-300" />
                  )}
                  <span
                    className={`text-sm ${todo.done ? "text-slate-400 line-through" : "text-slate-700 font-medium"}`}
                  >
                    {todo.label}
                  </span>
                  {todo.recurring ? (
                    <span className="ml-auto shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                      반복
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
          {todos.length === 0 ? (
            <p className="mt-2 text-sm text-slate-400">현재 체크리스트 데이터가 없습니다.</p>
          ) : null}
          {hiddenTodoCount > 0 ? (
            <button
              type="button"
              onClick={onClickTodoMore}
              className="mt-3 text-xs font-semibold text-[#2454C8] hover:text-[#1d44a8]"
            >
              +{hiddenTodoCount}개 더보기
            </button>
          ) : null}
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {isLoading ? (
            <p className="text-sm text-slate-400">일정 불러오는 중...</p>
          ) : scheduleEvents.length === 0 ? (
            <p className="text-sm text-slate-400">선택한 날짜의 일정이 없습니다.</p>
          ) : (
            <ul className="space-y-2">
              {scheduleEvents.map((event) => (
                <li
                  key={event.id}
                  className="flex items-start gap-3 rounded-2xl border border-border/40 px-4 py-3"
                >
                  <div className="shrink-0 pt-0.5">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${SCHEDULE_EVENT_TYPE_STYLE[event.type] ?? SCHEDULE_EVENT_TYPE_STYLE.notice}`}
                    >
                      {SCHEDULE_EVENT_TYPE_LABEL[event.type] ?? event.type}
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
          )}
          {hiddenEventCount > 0 ? (
            <button
              type="button"
              onClick={onClickEventMore}
              className="mt-3 text-xs font-semibold text-[#2454C8] hover:text-[#1d44a8]"
            >
              +{hiddenEventCount}개 더보기
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
