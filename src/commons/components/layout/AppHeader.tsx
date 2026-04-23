import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Clock3, Menu, RotateCcw, X } from "lucide-react";

import bizLogo from "@/assets/biz_logo.png";
import dunkinLogo from "@/assets/dunkin_logo.png";
import { formatCount } from "@/commons/utils/format-count";
import type { ApiNotification } from "@/features/notifications/types/notifications";
import { useGetStoresQuery } from "@/features/stores/queries/useGetStoresQuery";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";

const breadcrumbMap: Record<string, string[]> = {
  "/": ["시작 페이지"],
  "/dashboard": ["홈"],
  "/production": ["매장 운영", "생산 관리", "생산 현황"],
  "/production/status": ["매장 운영", "생산 관리", "생산 현황"],
  "/production/waste-loss": ["매장 운영", "생산 관리", "폐기 손실 현황"],
  "/production/inventory-diagnosis": ["매장 운영", "생산 관리", "재고 수준 진단"],
  "/ordering": ["매장 운영", "주문 관리", "주문 추천안 비교"],
  "/ordering/recommendations": ["매장 운영", "주문 관리", "주문 추천안 비교"],
  "/ordering/history": ["매장 운영", "주문 관리", "발주 이력"],
  "/sales": ["분석", "매장 분석", "지표 분석"],
  "/sales/metrics": ["분석", "매장 분석", "지표 분석"],
  "/analytics": ["분석", "매장 분석", "매출 현황"],
  "/analytics/market": ["분석", "매장 분석", "상권/고객 분석"],
  "/settings": ["본사", "시스템 설정", "Agent 레지스트리"],
  "/settings/orchestration": ["본사", "시스템 설정", "오케스트레이션"],
  "/settings/connectors": ["본사", "시스템 설정", "데이터 커넥터"],
  "/settings/access": ["본사", "시스템 설정", "RBAC & 접근 제어"],
  "/settings/prompts": ["본사", "시스템 설정", "AI 프롬프트 설정"],
  "/settings/golden-queries": ["본사", "시스템 설정", "골든 쿼리 관리"],
  "/settings/audit-logs": ["본사", "시스템 설정", "대화 감사 로그"],
  "/settings/quality-archive": ["본사", "시스템 설정", "품질 검증 아카이브"],
  "/settings/notices": ["본사", "시스템 설정", "공지사항"],
};

type Props = {
  onMenuToggle: () => void;
  notifications: ApiNotification[];
  unreadCount: number;
};

export function AppHeader({ onMenuToggle, notifications, unreadCount }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isStoreMenuOpen, setIsStoreMenuOpen] = useState(false);
  const [isReferenceMenuOpen, setIsReferenceMenuOpen] = useState(false);
  const { user, setStore, referenceDateTime, setReferenceDateTime, resetReferenceDateTime } =
    useDemoSession();
  const isHqAdmin = user.role === "hq_admin";
  const { data: stores = [] } = useGetStoresQuery(!isHqAdmin);
  const crumbs = breadcrumbMap[location.pathname] ?? ["통합 운영 대시보드"];

  useEffect(() => {
    if (stores.length === 0) {
      return;
    }
    if (stores.some((store) => store.store_id === user.storeId)) {
      return;
    }

    const fallbackStore = stores[0];
    setStore(fallbackStore.store_id, `${fallbackStore.store_name}점`);
  }, [setStore, stores, user.storeId]);

  const handleNotificationClick = (id: number) => {
    setIsInboxOpen(false);
    const item = notifications.find((n) => n.id === id);
    if (!item?.link_to) return;
    navigate(item.link_to, { state: item.link_state ?? undefined });
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-[52px] border-b border-[#DADADA] bg-white px-4">
      <div className="flex h-full items-center justify-between">
        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#dce4f3] bg-[#f7faff] text-slate-500 transition-colors hover:border-[#bfd1ed] hover:text-slate-700 lg:hidden"
          aria-label="메뉴 열기"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/** Logo */}
        <div className="flex items-center gap-2">
          <img src={bizLogo} alt="BR Korea" className="h-4.5" />
          <div className="w-[2px] h-[16px] bg-[#DADADA]" />
          <img src={dunkinLogo} alt="Dunkin" className="h-4" />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsReferenceMenuOpen((v) => !v)}
              className="flex h-[42px] w-[230px] items-center justify-between rounded-xl border border-[#DCE4F3] bg-[#F7FAFF] px-[10px] transition-colors hover:border-[#bfd1ed]"
              aria-label="기준 일자 및 시간 설정"
            >
              <div className="flex items-center gap-2">
                <div className="grid size-7 place-items-center rounded-lg bg-[#EEF4FF] text-[#2454C8]">
                  <Clock3 className="h-4 w-4" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-[11px] leading-tight text-slate-500">기준 일자 및 시간</p>
                  <p className="truncate text-[12px] font-semibold leading-tight text-slate-800">
                    {referenceDateTime.replace("T", " ")}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform ${isReferenceMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isReferenceMenuOpen ? (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setIsReferenceMenuOpen(false)}
                  aria-label="기준 일시 메뉴 닫기"
                />
                <div className="absolute right-0 top-12 z-50 w-[290px] overflow-hidden rounded-2xl border border-border bg-white shadow-[0_24px_60px_rgba(31,77,187,0.16)]">
                  <div className="border-b border-border/70 px-4 py-3">
                    <p className="text-xs font-semibold text-slate-500">데이터 검증 기준</p>
                  </div>
                  <div className="space-y-3 px-4 py-3">
                    <label className="space-y-1.5">
                      <span className="text-xs font-medium text-slate-600">기준 일시</span>
                      <input
                        type="datetime-local"
                        value={referenceDateTime}
                        onChange={(event) => setReferenceDateTime(event.target.value)}
                        className="w-full rounded-lg border border-[#d5def0] bg-white px-2.5 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-[#9ab8ef]"
                      />
                    </label>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] text-slate-500">기본값: 3월 5일 00:00</p>
                      <button
                        type="button"
                        onClick={resetReferenceDateTime}
                        className="inline-flex items-center gap-1 rounded-md border border-[#d5def0] px-2 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:border-[#bfd1ed] hover:text-slate-800"
                      >
                        <RotateCcw className="h-3 w-3" />
                        초기화
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>

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
                  {formatCount(unreadCount)}
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
                    {notifications.length === 0 ? (
                      <p className="px-4 py-6 text-center text-sm text-slate-400">
                        새 알림이 없어요.
                      </p>
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
                          <span className="shrink-0 text-[10px] text-slate-400">
                            {item.created_at}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </>
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsStoreMenuOpen((v) => !v)}
              className="flex h-[42px] w-[220px] items-center justify-between rounded-xl border border-[#DCE4F3] bg-[#F7FAFF] px-[10px] transition-colors hover:border-[#bfd1ed] sm:w-[250px] md:w-[270px]"
              aria-label="점포 전환"
            >
              <div className="size-[28px] overflow-hidden rounded-full border border-[#CCDAF0] bg-[linear-gradient(135deg,#316BFF_0%,#4AA2FF_100%)] text-white">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="size-full object-cover" />
                ) : (
                  <div className="grid size-full place-items-center text-[12px] font-bold">
                    {user.initials}
                  </div>
                )}
              </div>
              <div className="mx-2 flex-1 truncate text-left">
                <p className="truncate text-[13px] font-semibold leading-tight text-slate-800">
                  {user.storeName}
                </p>
                <p className="truncate text-[11px] leading-tight text-slate-500">{user.storeId}</p>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform ${isStoreMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isStoreMenuOpen ? (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setIsStoreMenuOpen(false)}
                  aria-label="점포 메뉴 닫기"
                />
                <div className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-2xl border border-border bg-white shadow-[0_24px_60px_rgba(31,77,187,0.16)]">
                  <div className="border-b border-border/70 px-4 py-3">
                    <p className="text-xs font-semibold text-slate-500">점포 선택</p>
                  </div>
                  <div className="max-h-72 overflow-y-auto py-1">
                    {stores.map((store) => (
                      <button
                        key={store.store_id}
                        type="button"
                        onClick={() => {
                          setStore(store.store_id, `${store.store_name}점`);
                          setIsStoreMenuOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[#eef4ff] ${
                          user.storeId === store.store_id ? "bg-[#f0f5ff]" : ""
                        }`}
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EEF4FF] text-[11px] font-bold text-[#2454C8]">
                          {store.store_name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-semibold text-slate-800">
                            {store.store_name}점
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {store.sido} · {store.store_id}
                          </p>
                        </div>
                        {user.storeId === store.store_id ? (
                          <span className="material-symbols-outlined text-[16px] text-[#2454C8]">
                            check
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
