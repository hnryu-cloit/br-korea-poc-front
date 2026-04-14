import { Clock } from "lucide-react";

export function OrderingDeadlineAlert({
  timeText,
  progressPct,
}: {
  timeText: string;
  progressPct: number;
}) {
  return (
    <section className="rounded-[28px] border border-orange-200 bg-orange-50 px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Clock className="h-8 w-8 text-orange-500" />
          <div>
            <p className="text-base font-bold text-orange-900">주문 마감 20분 전 알림</p>
            <p className="mt-1 text-3xl font-bold text-orange-700">{timeText}</p>
          </div>
        </div>
        <div className="h-3 w-48 rounded-full bg-white/70">
          <div className="h-3 rounded-full bg-[#2454C8]" style={{ width: `${progressPct}%` }} />
        </div>
      </div>
    </section>
  );
}
