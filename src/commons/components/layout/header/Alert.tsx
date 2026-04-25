import { Bell, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { formatCount } from "@/commons/utils/format-count";
import type { ApiNotification } from "@/features/notifications/types/notifications";

type Props = {
  notifications: ApiNotification[];
  unreadCount: number;
};

export function Alert({ notifications, unreadCount }: Props) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleNotificationClick = (id: number) => {
    setIsOpen(false);
    const item = notifications.find((notification) => notification.id === id);
    if (!item?.link_to) return;
    navigate(item.link_to, { state: item.link_state ?? undefined });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-[#dce4f3] bg-[#f7faff] text-slate-500 transition-colors hover:border-[#bfd1ed] hover:text-slate-700"
        aria-label="알림 인박스"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {formatCount(unreadCount)}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setIsOpen(false)}
            aria-label="알림 닫기"
          />
          <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-3xl border border-border bg-white shadow-[0_24px_60px_rgba(31,77,187,0.16)]">
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">알림 인박스</p>
                <p className="text-xs text-slate-400">생산, 주문, 분석 상태 업데이트</p>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="닫기">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-slate-400">새 알림이 없어요.</p>
              ) : (
                notifications.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNotificationClick(item.id)}
                    className={`flex w-full items-start gap-3 border-b border-border/40 px-4 py-3 text-left last:border-0 ${item.unread ? "bg-[#F7FAFF]" : "bg-white"} ${item.link_to ? "hover:bg-[#eef4ff]" : ""}`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${item.category === "alert" ? "bg-red-50" : "bg-[#EEF4FF]"}`}
                    >
                      <span
                        className={`material-symbols-outlined text-[14px] ${item.category === "alert" ? "text-red-500" : "text-primary"}`}
                      >
                        {item.category === "alert"
                          ? "notification_important"
                          : item.category === "workflow"
                            ? "account_tree"
                            : "analytics"}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-semibold ${item.unread ? "text-slate-900" : "text-slate-600"}`}
                      >
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-400">{item.description}</p>
                    </div>
                    <span className="shrink-0 text-[10px] text-slate-400">{item.created_at}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
