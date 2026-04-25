import { useCallback, useEffect, useState } from "react";

import {
  ORDERING_REMINDER_CHECK_INTERVAL_MS,
  ORDERING_REMINDER_STORAGE_KEY,
  ORDERING_REMINDER_TOAST_DURATION_MS,
} from "@/features/ordering/constants/ordering-deadline-reminder";
import type {
  OrderingReminderPanelItem,
  OrderingReminderStorage,
  OrderingReminderToastState,
} from "@/features/ordering/types/ordering-deadline-reminder";
import {
  buildOrderingReminderEvents,
  keepOnlyTodayReminderStorage,
  parseOrderingReminderStorage,
  toOrderingDateKey,
} from "@/features/ordering/utils/ordering-deadline-reminder";

export function useOrderingDeadlineReminder(deadlineTimes: string[], referenceDateTime: string) {
  const [storage, setStorage] = useState<OrderingReminderStorage>(() =>
    parseOrderingReminderStorage(window.sessionStorage.getItem(ORDERING_REMINDER_STORAGE_KEY)),
  );
  const [toast, setToast] = useState<OrderingReminderToastState | null>(null);
  const [activePanelItems, setActivePanelItems] = useState<OrderingReminderPanelItem[]>([]);

  useEffect(() => {
    window.sessionStorage.setItem(ORDERING_REMINDER_STORAGE_KEY, JSON.stringify(storage));
  }, [storage]);

  const evaluateReminderState = useCallback(() => {
    const parsedReferenceDate = new Date(referenceDateTime);
    const now = Number.isNaN(parsedReferenceDate.getTime()) ? new Date() : parsedReferenceDate;
    const todayKey = toOrderingDateKey(now);
    const events = buildOrderingReminderEvents(deadlineTimes, now);

    setStorage((current) => keepOnlyTodayReminderStorage(current, todayKey));

    const activeCandidates = events.filter((event) => {
      const nowMs = now.getTime();
      return (
        nowMs >= event.reminderDate.getTime() &&
        nowMs < event.deadlineDate.getTime() &&
        !storage.confirmed[event.key]
      );
    });

    setActivePanelItems(
      activeCandidates.map((event) => ({
        key: event.key,
        deadlineAt: event.deadlineAt,
        remainingMinutes: Math.max(
          0,
          Math.ceil((event.deadlineDate.getTime() - now.getTime()) / (60 * 1000)),
        ),
      })),
    );

    const toastTargets = activeCandidates.filter((event) => !storage.shown[event.key]);
    if (toastTargets.length === 0) return;

    setStorage((current) => ({
      ...current,
      shown: {
        ...current.shown,
        ...Object.fromEntries(toastTargets.map((event) => [event.key, Date.now()])),
      },
    }));
    setToast({
      id: Date.now(),
      deadlineTimes: toastTargets.map((event) => event.deadlineAt),
    });
  }, [deadlineTimes, referenceDateTime, storage.confirmed, storage.shown]);

  useEffect(() => {
    const bootstrapTimer = window.setTimeout(evaluateReminderState, 0);
    const interval = window.setInterval(evaluateReminderState, ORDERING_REMINDER_CHECK_INTERVAL_MS);
    const onVisibilityChange = () => {
      if (!document.hidden) {
        evaluateReminderState();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.clearTimeout(bootstrapTimer);
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [evaluateReminderState]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => {
      setToast((current) => (current?.id === toast.id ? null : current));
    }, ORDERING_REMINDER_TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const confirmReminder = useCallback((eventKey: string) => {
    setStorage((current) => ({
      ...current,
      confirmed: {
        ...current.confirmed,
        [eventKey]: Date.now(),
      },
    }));
    setActivePanelItems((current) => current.filter((event) => event.key !== eventKey));
  }, []);

  return {
    toast,
    activePanelItems,
    confirmReminder,
  };
}
