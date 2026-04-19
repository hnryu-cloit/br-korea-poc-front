import { useEffect, useState } from "react";

import { AppModal } from "@/commons/components/modal/AppModal";
import {
  subscribeSessionExpired,
  type SessionExpiredDetail,
} from "@/commons/utils/session-expiry";

type ToastState = {
  id: number;
  message: string;
};

export function SessionExpiryGuard() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [modal, setModal] = useState<SessionExpiredDetail | null>(null);

  useEffect(() => {
    return subscribeSessionExpired((detail) => {
      const nextToast: ToastState = {
        id: Date.now(),
        message: detail.message,
      };
      setToast(nextToast);
      setModal(detail);
    });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => {
      setToast((current) => (current?.id === toast.id ? null : current));
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const moveToLogin = () => {
    const redirectPath = modal?.redirectPath?.trim() || "/";
    setModal(null);
    window.location.href = redirectPath;
  };

  return (
    <>
      {toast ? (
        <div className="pointer-events-none fixed right-5 top-[84px] z-[60] rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 shadow-[0_8px_20px_rgba(16,32,51,0.08)]">
          {toast.message}
        </div>
      ) : null}

      {modal ? (
        <AppModal onClose={() => setModal(null)}>
          <section className="mx-auto w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-[0_16px_36px_rgba(16,32,51,0.2)]">
            <p className="text-lg font-bold text-slate-900">세션이 만료되었습니다</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              보안을 위해 다시 인증이 필요합니다. 로그인 페이지로 이동해 주세요.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={moveToLogin}
                className="rounded-xl bg-[#2454C8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1f46a8]"
              >
                다시 로그인
              </button>
            </div>
          </section>
        </AppModal>
      ) : null}
    </>
  );
}
