import { Bell, CalendarDays, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";

import type { CarouselBannerItem } from "@/commons/components/carousel/InPageCarousel";
import { InPageCarousel } from "@/commons/components/carousel/InPageCarousel";
import { useDashboardTodos } from "@/features/dashboard/hooks/useDashboardTodos";
import type { ScheduleEvent, ScheduleNotice, ScheduleTodoItem } from "@/features/dashboard/types/schedule";

type Tab = "todo" | "schedule" | "notice";

const TAB_LABELS: Record<Tab, string> = {
  todo: "오늘 할일",
  schedule: "주요 일정",
  notice: "공지·프로모션",
};

const EVENT_TYPE_STYLE: Record<string, string> = {
  campaign: "bg-blue-50 text-blue-700 border-blue-200",
  telecom: "bg-purple-50 text-purple-700 border-purple-200",
  notice: "bg-slate-50 text-slate-600 border-slate-200",
};
const EVENT_TYPE_LABEL: Record<string, string> = {
  campaign: "캠페인",
  telecom: "통신사 할인",
  notice: "공지",
};

function formatDate(yyyymmdd: string): string {
  if (yyyymmdd.length !== 8) return yyyymmdd;
  return `${yyyymmdd.slice(4, 6)}/${yyyymmdd.slice(6, 8)}`;
}

function getDDayLabel(yyyymmdd: string): string {
  const today = new Date();
  const target = new Date(
    Number(yyyymmdd.slice(0, 4)),
    Number(yyyymmdd.slice(4, 6)) - 1,
    Number(yyyymmdd.slice(6, 8)),
  );
  const diff = Math.ceil((target.getTime() - today.setHours(0, 0, 0, 0)) / 86_400_000);
  if (diff === 0) return "오늘";
  if (diff < 0) return "진행중";
  return `D-${diff}`;
}

export function DashboardSchedulePanel({
  storeId,
  events,
  notices,
  todos,
  updatedAt,
  source,
  isLoading,
}: {
  storeId?: string;
  events: ScheduleEvent[];
  notices: ScheduleNotice[];
  todos: ScheduleTodoItem[];
  updatedAt?: string;
  source?: string;
  isLoading: boolean;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("todo");
  const {
    todos: resolvedTodos,
    toggleTodo,
    completedCount,
  } = useDashboardTodos(storeId, todos);

  const upcomingEvents = events.slice(0, 8);
  const noticeBanners: CarouselBannerItem[] = notices.map((notice) => ({
    id: notice.id,
    tag: notice.tag,
    title: notice.title,
    description: notice.description,
    tagColor: notice.tone,
  }));

  return (
    <section className="overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      {/* 탭 헤더 */}
      <div className="border-b border-border/60 px-6 py-4">
        <div className="flex items-center gap-1">
          {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-[#1f4dbb] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* 오늘 할일 탭 */}
      {activeTab === "todo" && (
        <div className="px-6 py-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Bell className="h-3.5 w-3.5" />
            매일 반복 운영 체크리스트
          </div>
          <ul className="space-y-2">
            {resolvedTodos.map((todo) => (
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
                  <span className={`text-sm ${todo.done ? "text-slate-400 line-through" : "text-slate-700 font-medium"}`}>
                    {todo.label}
                  </span>
                  {todo.recurring && (
                    <span className="ml-auto shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">반복</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          {resolvedTodos.length === 0 ? (
            <p className="mt-2 text-sm text-slate-400">현재 체크리스트 데이터가 없습니다.</p>
          ) : null}
          <p className="mt-3 text-xs text-slate-400">
            완료 {completedCount} / {resolvedTodos.length}
          </p>
        </div>
      )}

      {/* 주요 일정 탭 */}
      {activeTab === "schedule" && (
        <div className="px-6 py-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-400">
            <CalendarDays className="h-3.5 w-3.5" />
            이번 달 캠페인 및 할인 일정
          </div>
          {isLoading ? (
            <p className="text-sm text-slate-400">일정 불러오는 중...</p>
          ) : upcomingEvents.length === 0 ? (
            <p className="text-sm text-slate-400">이번 달 예정 일정이 없습니다.</p>
          ) : (
            <ul className="space-y-2">
              {upcomingEvents.map((event) => (
                <li key={`${event.date}-${event.type}-${event.title}`} className="flex items-start gap-3 rounded-2xl border border-border/40 px-4 py-3">
                  <div className="shrink-0 pt-0.5">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${EVENT_TYPE_STYLE[event.type] ?? EVENT_TYPE_STYLE.notice}`}>
                      {EVENT_TYPE_LABEL[event.type] ?? event.type}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{event.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{event.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs font-bold text-[#2454C8]">{getDDayLabel(event.date)}</p>
                    <p className="text-[10px] text-slate-400">{formatDate(event.date)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 공지·프로모션 탭 */}
      {activeTab === "notice" && (
        <div className="px-6 py-4">
          <div className="mb-3 flex items-center justify-between gap-2 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-2">
              <Bell className="h-3.5 w-3.5" />
              본사 공지 및 프로모션
            </div>
            <span className="rounded-full border border-[#d7e4ff] bg-[#f5f9ff] px-2 py-0.5 text-[10px] font-semibold text-[#2454C8]">
              {source ? `${source}` : "source:unknown"} · {updatedAt ? updatedAt : "-"}
            </span>
          </div>
          {noticeBanners.length > 0 ? (
            <InPageCarousel items={noticeBanners} autoPlayMs={4000} />
          ) : (
            <p className="text-sm text-slate-400">노출 가능한 공지 데이터가 없습니다.</p>
          )}
        </div>
      )}
    </section>
  );
}
