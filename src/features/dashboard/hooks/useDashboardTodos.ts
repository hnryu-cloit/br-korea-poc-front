import { useState } from "react";

import type { DashboardTodoItem, ScheduleTodoItem } from "@/features/dashboard/types/dashboard";
import { formatCalendarDate } from "@/features/dashboard/utils/schedule-panel";

const STORAGE_KEY_PREFIX = "dashboard-todos-v1";

const canUseSessionStorage = () =>
  typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";

const buildStorageKey = (storeId?: string) =>
  `${STORAGE_KEY_PREFIX}:${storeId && storeId.trim() ? storeId.trim() : "all"}`;

const toDashboardTodo = (todo: ScheduleTodoItem): DashboardTodoItem => ({
  id: todo.id,
  label: todo.label,
  recurring: todo.recurring,
  done: false,
});

const sanitizeTodos = (raw: unknown, sourceTodos: DashboardTodoItem[]): DashboardTodoItem[] => {
  if (!Array.isArray(raw)) return sourceTodos;
  const doneById = new Map<string, boolean>();
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const candidate = item as Partial<DashboardTodoItem>;
    if (typeof candidate.id !== "string") continue;
    doneById.set(candidate.id, Boolean(candidate.done));
  }
  return sourceTodos.map((item) => ({
    ...item,
    done: doneById.get(item.id) ?? item.done,
  }));
};

export function useDashboardTodos(
  storeId?: string,
  selectedDate?: Date,
  baseTodos: ScheduleTodoItem[] = [],
) {
  const [, setVersion] = useState(0);
  const storageKey = `${buildStorageKey(storeId)}:${formatCalendarDate(selectedDate ?? new Date())}`;
  const sourceTodos: DashboardTodoItem[] = baseTodos.map(toDashboardTodo);

  const readTodos = (key: string): DashboardTodoItem[] => {
    if (sourceTodos.length === 0) return [];
    if (!canUseSessionStorage()) return sourceTodos;
    try {
      const raw = window.sessionStorage.getItem(key);
      if (!raw) return sourceTodos;
      return sanitizeTodos(JSON.parse(raw), sourceTodos);
    } catch {
      return sourceTodos;
    }
  };

  const todos = readTodos(storageKey);

  const toggleTodo = (id: string) => {
    const next = todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo));
    if (canUseSessionStorage()) {
      window.sessionStorage.setItem(storageKey, JSON.stringify(next));
    }
    setVersion((value) => value + 1);
  };

  return {
    todos,
    toggleTodo,
    completedCount: todos.filter((todo) => todo.done).length,
  };
}
