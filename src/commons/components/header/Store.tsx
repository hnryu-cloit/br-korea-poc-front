import { ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getStoreAvatarBackgroundColor } from "@/commons/utils/get-store-avatar-background-color";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";
import { useGetStoresQuery } from "@/features/stores/queries/useGetStoresQuery";

export function Store() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, setStore } = useDemoSession();
  const isHqAdmin = user.role === "hq_admin";
  const { data: stores = [] } = useGetStoresQuery(!isHqAdmin);

  useEffect(() => {
    if (stores.length === 0) return;

    const matched = stores.find((store) => store.store_id === user.storeId);
    if (matched) {
      const expectedName = `${matched.store_name}점`;
      if (user.storeName !== expectedName) {
        setStore(matched.store_id, expectedName);
      }
      return;
    }

    const fallbackStore = stores[0];
    setStore(fallbackStore.store_id, `${fallbackStore.store_name}점`);
  }, [setStore, stores, user.storeId, user.storeName]);

  const filteredStores = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    return stores.filter((store) => {
      if (!normalized) return true;

      const haystack = [store.store_name, store.store_id, store.sido].join(" ").toLowerCase();
      return haystack.includes(normalized);
    });
  }, [searchTerm, stores]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex h-[42px] w-[200px] items-center justify-between rounded-[12px] border border-[#DADADA] bg-white px-3 py-0.5"
        aria-label="점포 전환"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="h-8 w-8 rounded-full text-sm leading-8 text-[#1D293D]"
            style={{
              backgroundColor: getStoreAvatarBackgroundColor({
                store_id: user.storeId,
                store_name: user.storeName,
              }),
            }}
          >
            {user.initials}
          </div>
          <p className="text-sm font-bold text-[#314158]">{user.storeName}</p>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-[#653819] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => {
              setIsOpen(false);
              setSearchTerm("");
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
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="h-8 w-full rounded-xl border border-[#DADADA] bg-white px-5 py-1 text-sm text-[#1D293D] outline-none placeholder:text-[#716862]"
                />
                <Search
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#716862]"
                  strokeWidth={2}
                />
              </label>
            </div>
            <div className="flex max-h-72 flex-col overflow-y-auto px-4">
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
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={`flex gap-2.5 rounded-[4px] px-2 py-1 hover:bg-[#D0CDCB4D] ${user.storeId === store.store_id ? "bg-[#D0CDCB4D]" : ""}`}
                  >
                    <div
                      className="h-8 w-8 rounded-full text-sm leading-8 text-[#1D293D]"
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
  );
}
