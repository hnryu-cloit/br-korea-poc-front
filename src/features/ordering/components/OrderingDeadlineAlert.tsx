import { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";

export function OrderingDeadlineAlert({
  deadlineAt,
}: {
  deadlineAt?: string | null;
}) {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const deadlineDate = useMemo(() => {
    if (!deadlineAt) return null;
    const [hourText, minuteText] = deadlineAt.split(":");
    const hour = Number.parseInt(hourText ?? "", 10);
    const minute = Number.parseInt(minuteText ?? "", 10);
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
    const date = new Date(nowMs);
    date.setHours(hour, minute, 0, 0);
    return date;
  }, [deadlineAt, nowMs]);

  if (!deadlineDate) {
    return (
      <section className="rounded-[28px] border border-orange-200 bg-orange-50 px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <div className="flex items-center gap-3">
          <Clock className="h-8 w-8 text-orange-500" />
          <div>
            <p className="text-base font-bold text-orange-900">주문 마감 20분 전 알림</p>
            <p className="mt-1 text-sm font-medium text-orange-700">주문 마감 시간 정보가 없습니다.</p>
          </div>
        </div>
      </section>
    );
  }

  const remainingSeconds = Math.floor((deadlineDate.getTime() - nowMs) / 1000);
  const alertWindowSeconds = 20 * 60;
  const remainingForTimer = Math.max(0, remainingSeconds);
  const hour = Math.floor(remainingForTimer / 3600);
  const minute = Math.floor((remainingForTimer % 3600) / 60);
  const second = remainingForTimer % 60;
  const timeText = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
  const statusLabel = remainingSeconds <= 0
    ? "마감 완료"
    : remainingSeconds <= alertWindowSeconds
      ? "20분 전 알림 구간"
      : "알림 대기";

  return (
    <section className="rounded-[28px] border border-orange-200 bg-orange-50 px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Clock className="h-8 w-8 text-orange-500" />
          <div>
            <p className="text-base font-bold text-orange-900">주문 마감 20분 전 알림</p>
            <p className="mt-1 text-sm text-orange-800">주문 마감 시각과 남은 시간을 확인하세요.</p>
          </div>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-orange-700">
          {statusLabel}
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-orange-200 bg-white/70 px-4 py-4">
          <p className="text-xs font-semibold tracking-wide text-orange-700">주문 마감 시간</p>
          <p className="mt-1 text-2xl font-bold text-orange-900">{deadlineAt}</p>
        </div>
        <div className="rounded-2xl border border-orange-200 bg-white/70 px-4 py-4">
          <p className="text-xs font-semibold tracking-wide text-orange-700">마감까지 남은 시간</p>
          <p className="mt-1 text-2xl font-bold text-orange-900">{timeText}</p>
        </div>
      </div>
    </section>
  );
}
