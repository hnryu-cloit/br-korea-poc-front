import { BellRing, Clock3 } from "lucide-react";
import { useMemo } from "react";

import { useOrderingDeadlineReminder } from "@/features/ordering/hooks/useOrderingDeadlineReminder";
import { useGetOrderingDeadlineQuery } from "@/features/ordering/queries/useGetOrderingDeadlineQuery";

export function OrderingDeadlineReminder({ deadlineTimes }: { deadlineTimes?: string[] } = {}) {
  const deadlineQuery = useGetOrderingDeadlineQuery();
  const effectiveDeadlineTimes = useMemo(() => {
    const fromProps = (deadlineTimes ?? []).filter(Boolean);
    if (fromProps.length > 0) {
      return fromProps;
    }
    const fromApi = deadlineQuery.data?.deadline;
    return fromApi ? [fromApi] : [];
  }, [deadlineQuery.data?.deadline, deadlineTimes]);
  const { toast, activePanelItems, confirmReminder } =
    useOrderingDeadlineReminder(effectiveDeadlineTimes);

  return (
    <>
      {toast ? (
        <div className="pointer-events-none fixed right-5 top-[84px] z-[60] rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 shadow-[0_8px_20px_rgba(16,32,51,0.08)] max-md:left-4 max-md:right-4">
          {toast.deadlineTimes.join(", ")} 주문 마감 20분 전입니다.
        </div>
      ) : null}

      {activePanelItems.length > 0 ? (
        <aside className="fixed right-5 top-[132px] z-[55] w-[360px] rounded-2xl border border-orange-200 bg-white p-4 shadow-[0_18px_36px_rgba(16,32,51,0.16)] max-md:left-4 max-md:right-4 max-md:w-auto">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <BellRing className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900">주문 마감 리마인더</p>
              <p className="mt-1 text-sm text-slate-600">20분 이내 마감 건을 확인하세요.</p>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                <Clock3 className="h-3.5 w-3.5" />
                확인 전까지 목록에서 유지됩니다.
              </div>
              <ul className="mt-4 space-y-2">
                {activePanelItems.map((item) => (
                  <li
                    key={item.key}
                    className="flex items-center justify-between rounded-lg border border-orange-100 bg-orange-50/40 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {item.deadlineAt} 주문 마감
                      </p>
                      <p className="text-xs text-slate-600">{item.remainingMinutes}분 남음</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => confirmReminder(item.key)}
                      className="rounded-lg bg-[#2454C8] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1e46a8]"
                    >
                      확인
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      ) : null}
    </>
  );
}
