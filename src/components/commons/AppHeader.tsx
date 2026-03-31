import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Menu, X } from "lucide-react";

import { notifications } from "../../data/notifications";
import { useDemoSession } from "../../contexts/DemoSessionContext";

const breadcrumbMap: Record<string, string[]> = {
  "/": ["홈"],
  "/production": ["생산 현황"],
  "/ordering": ["주문 관리"],
  "/sales": ["매출 현황"],
  "/analytics": ["매출 조회"],
  "/sv/coaching": ["수퍼바이저", "주문 코칭"],
  "/sv/inspection": ["수퍼바이저", "생산 점검"],
  "/orchestration": ["시스템 현황"],
  "/signals": ["본사", "매출 시그널"],
};

type Props = {
  onMenuToggle: () => void;
};

export function AppHeader({ onMenuToggle }: Props) {
  const location = useLocation();
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const { user } = useDemoSession();
  const crumbs = breadcrumbMap[location.pathname] ?? ["통합 운영 대시보드"];
  const unreadCount = notifications.filter((item) => item.unread).length;

  return (
    <header className="fixed left-0 right-0 top-0 z-30 h-[68px] border-b border-border bg-white/90 backdrop-blur-sm lg:left-64">
      <div className="flex h-full items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={onMenuToggle}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#dce4f3] bg-[#f7faff] text-slate-500 transition-colors hover:border-[#bfd1ed] hover:text-slate-700 lg:hidden"
            aria-label="메뉴 열기"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden text-sm font-medium text-slate-400 sm:block">AgentGo Biz</span>
            {crumbs.map((crumb, index) => (
              <span key={crumb} className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-slate-300">chevron_right</span>
                <span className={index === crumbs.length - 1 ? "text-base font-semibold text-slate-800" : "text-sm font-medium text-slate-400"}>
                  {crumb}
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsInboxOpen((value) => !value)}
              className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-[#dce4f3] bg-[#f7faff] text-slate-500 transition-colors hover:border-[#bfd1ed] hover:text-slate-700"
              aria-label="알림 인박스"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              ) : null}
            </button>

            {isInboxOpen ? (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setIsInboxOpen(false)}
                  aria-label="알림 닫기"
                />
                <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-3xl border border-border bg-white shadow-[0_24px_60px_rgba(31,77,187,0.16)]">
                  <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">알림 인박스</p>
                      <p className="text-xs text-slate-400">생산, 주문, 분석 상태 업데이트</p>
                    </div>
                    <button type="button" onClick={() => setIsInboxOpen(false)} aria-label="닫기">
                      <X className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-start gap-3 border-b border-border/40 px-4 py-3 last:border-0 ${item.unread ? "bg-[#F7FAFF]" : "bg-white"}`}
                      >
                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${item.category === "alert" ? "bg-red-50" : "bg-[#EEF4FF]"}`}>
                          <span className={`material-symbols-outlined text-[14px] ${item.category === "alert" ? "text-red-500" : "text-primary"}`}>
                            {item.category === "alert" ? "notification_important" : item.category === "workflow" ? "account_tree" : "analytics"}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-semibold ${item.unread ? "text-slate-900" : "text-slate-600"}`}>{item.title}</p>
                          <p className="text-xs text-slate-400">{item.description}</p>
                        </div>
                        <span className="shrink-0 text-[10px] text-slate-400">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>

          <div className="hidden h-[42px] w-[270px] items-center justify-between rounded-xl border border-[#DCE4F3] bg-[#F7FAFF] px-[10px] md:flex">
            <div className="size-[28px] overflow-hidden rounded-full border border-[#CCDAF0] bg-[linear-gradient(135deg,#316BFF_0%,#4AA2FF_100%)] text-white">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="size-full object-cover" />
              ) : (
                <div className="grid size-full place-items-center text-[12px] font-bold">{user.initials}</div>
              )}
            </div>
            <div className="mx-2 flex-1 truncate">
              <p className="truncate text-[13px] font-semibold leading-tight text-slate-800">{user.name}</p>
              <p className="truncate text-[11px] leading-tight text-slate-500">{user.email}</p>
            </div>
            <button className="text-slate-400" aria-label="user menu" type="button">
              <span className="material-symbols-outlined text-[18px]">more_vert</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}