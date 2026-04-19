const SESSION_EXPIRED_EVENT = "app:session-expired";

export interface SessionExpiredDetail {
  message: string;
  redirectPath?: string;
}

export function emitSessionExpired(detail: SessionExpiredDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<SessionExpiredDetail>(SESSION_EXPIRED_EVENT, {
      detail,
    }),
  );
}

export function subscribeSessionExpired(
  handler: (detail: SessionExpiredDetail) => void,
): () => void {
  if (typeof window === "undefined") return () => {};
  const listener = (event: Event) => {
    const customEvent = event as CustomEvent<SessionExpiredDetail>;
    if (!customEvent.detail) return;
    handler(customEvent.detail);
  };
  window.addEventListener(SESSION_EXPIRED_EVENT, listener as EventListener);
  return () => {
    window.removeEventListener(SESSION_EXPIRED_EVENT, listener as EventListener);
  };
}
