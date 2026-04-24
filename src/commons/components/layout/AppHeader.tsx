import { Bell, ChevronDown, Clock3, Menu, RotateCcw, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import bizLogo from "@/assets/biz_logo.png";
import dunkinLogo from "@/assets/dunkin_logo.png";
import { formatCount } from "@/commons/utils/format-count";
import type { ApiNotification } from "@/features/notifications/types/notifications";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";
import { useGetStoresQuery } from "@/features/stores/queries/useGetStoresQuery";
import type { Store } from "@/features/stores/types/stores";

const avatarBackgroundColor = ["#FFE2E2", "#DFF2FE", "#F1F5F9", "#CBFBF1", "#E0E7FF", "#FEF3C6"];

function getStoreAvatarBackgroundColor(store: Pick<Store, "store_id" | "store_name">) {
  if (!store) return "#FFE2E2";
  const seed = `${store.store_id}:${store.store_name}`;
  const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return avatarBackgroundColor[hash % avatarBackgroundColor.length];
}

type Props = {
  onMenuToggle: () => void;
  notifications: ApiNotification[];
  unreadCount: number;
};

export function AppHeader({ onMenuToggle, notifications, unreadCount }: Props) {
  const navigate = useNavigate();
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isStoreMenuOpen, setIsStoreMenuOpen] = useState(false);
  const [isReferenceMenuOpen, setIsReferenceMenuOpen] = useState(false);
  const [storeSearchTerm, setStoreSearchTerm] = useState("");
  const { user, setStore, referenceDateTime, setReferenceDateTime, resetReferenceDateTime } =
    useDemoSession();
  const isHqAdmin = user.role === "hq_admin";
  const { data: stores = [] } = useGetStoresQuery(!isHqAdmin);

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

  const normalizedStoreSearchTerm = storeSearchTerm.trim().toLowerCase();
  const filteredStores = stores.filter((store) => {
    if (!normalizedStoreSearchTerm) {
      return true;
    }

    const haystack = [store.store_name, store.store_id, store.sido].join(" ").toLowerCase();
    return haystack.includes(normalizedStoreSearchTerm);
  });

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
              className="flex h-[42px] w-[200px] items-center justify-between rounded-[12px] border border-[#DADADA] bg-white py-0.5 px-3"
              aria-label="점포 전환"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="h-8 w-8 rounded-full text-[#1D293D] text-sm leading-8"
                  style={{ backgroundColor: getStoreAvatarBackgroundColor(stores[0]) }}
                >
                  {user.initials}
                  {/* {stores[0].store_name.charAt(0)} */}
                </div>
                <p className="text-sm font-bold text-[#314158]">
                  {user.storeName}
                  {/* {stores[0].store_name} */}
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-[#653819] transition-transform ${isStoreMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isStoreMenuOpen ? (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => {
                    setIsStoreMenuOpen(false);
                    setStoreSearchTerm("");
                  }}
                  aria-label="점포 메뉴 닫기"
                />
                <div className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-[4px] border border-border bg-white">
                  <div className="px-4 py-3">
                    <label className="relative block" htmlFor="store-search">
                      <input
                        id="store-search"
                        type="text"
                        placeholder="검색"
                        value={storeSearchTerm}
                        onChange={(event) => setStoreSearchTerm(event.target.value)}
                        className="h-8 w-full rounded-xl border border-[#DADADA] bg-white py-1 px-5 text-sm text-[#1D293D] outline-none placeholder:text-[#716862]"
                      />
                      <Search
                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#716862]"
                        strokeWidth={2}
                      />
                    </label>
                  </div>
                  <div className="max-h-72 overflow-y-auto flex flex-col px-4">
                    {filteredStores.length === 0 ? (
                      <div className="px-2 py-6 text-center text-sm text-[#716862]">
                        검색 결과가 없습니다.
                      </div>
                    ) : (
                      filteredStores.map((store) => (
                        <button
                          key={store.store_id}
                          type="button"
                          onClick={() => {
                            setStore(store.store_id, `${store.store_name}점`);
                            setIsStoreMenuOpen(false);
                            setStoreSearchTerm("");
                          }}
                          className={`flex gap-2.5 px-2 py-1 rounded-[4px] hover:bg-[#D0CDCB4D] ${user.storeId === store.store_id && "bg-[#D0CDCB4D]"}`}
                        >
                          <div
                            className="h-8 w-8 rounded-full text-[#1D293D] text-sm leading-8"
                            style={{ backgroundColor: getStoreAvatarBackgroundColor(store) }}
                          >
                            {store.store_name.charAt(0)}
                          </div>
                          <div className="flex flex-col items-start">
                            <p className="text-sm font-bold text-brown-700">{store.store_name}점</p>
                            <p className="text-sm text-[#716862]">
                              {store.sido} · {store.store_id}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
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
