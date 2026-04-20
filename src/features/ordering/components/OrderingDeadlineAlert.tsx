import { useMemo, useState } from "react";
import { Clock, X } from "lucide-react";

import { AppModal } from "@/commons/components/modal/AppModal";
import { ORDERING_DEADLINE_TABLE_HEADERS } from "@/features/ordering/constants/ordering-deadline";
import { useOrderingDeadlineGroups } from "@/features/ordering/hooks/useOrderingDeadlineGroups";
import type { OrderingDeadlineItem } from "@/features/ordering/types/ordering";

export function OrderingDeadlineAlert({
  deadlineAt,
  deadlineItems,
}: {
  deadlineAt?: string | null;
  deadlineItems?: OrderingDeadlineItem[];
}) {
  const [activeModalDeadlineAt, setActiveModalDeadlineAt] = useState<string | null>(null);

  const normalizedItems = useMemo(() => {
    if (deadlineItems && deadlineItems.length > 0) {
      return deadlineItems;
    }
    if (deadlineAt) {
      return [
        {
          id: `fallback-${deadlineAt}`,
          sku_name: "품목 정보 없음",
          deadline_at: deadlineAt,
          is_ordered: false,
        },
      ];
    }
    return [];
  }, [deadlineAt, deadlineItems]);

  const groups = useOrderingDeadlineGroups(normalizedItems);
  const activeGroup = useMemo(
    () => groups.find((group) => group.deadlineAt === activeModalDeadlineAt) ?? null,
    [activeModalDeadlineAt, groups],
  );

  return (
    <section className="rounded-[28px] border border-orange-200 bg-orange-50 px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="mb-4 flex items-center gap-3">
        <Clock className="h-8 w-8 text-orange-500" />
        <div>
          <p className="text-base font-bold text-orange-900">주문 마감 시간 안내</p>
          <p className="mt-1 text-sm text-orange-800">마감 시간별 주문 품목과 상태를 확인하세요.</p>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-2xl border border-orange-200 bg-white/70 px-4 py-6 text-sm text-orange-700">
          주문 마감 데이터가 없습니다.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-orange-200 bg-white/80">
          <table className="w-full min-w-[920px] whitespace-nowrap text-sm">
            <thead>
              <tr className="border-b border-orange-100 bg-orange-100/60 text-left">
                {ORDERING_DEADLINE_TABLE_HEADERS.map((header) => (
                  <th key={header} className="px-4 py-3 text-xs font-bold text-orange-800">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.deadlineAt} className="border-b border-orange-100/70 last:border-0">
                  <td className="px-4 py-3 font-semibold text-orange-900">{group.deadlineAt}</td>
                  <td
                    className={`px-4 py-3 font-semibold ${
                      group.isClosed
                        ? "text-slate-500"
                        : group.isUrgent
                          ? "text-red-600"
                          : "text-orange-900"
                    }`}
                  >
                    {group.remainingText}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setActiveModalDeadlineAt(group.deadlineAt)}
                      className="text-left font-medium text-[#2454C8] hover:text-[#1d44a8]"
                    >
                      {group.extraItemCount > 0
                        ? `${group.primarySkuName} 외 ${group.extraItemCount}개`
                        : group.primarySkuName}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                        group.isClosed
                          ? "border border-slate-300 bg-slate-100 text-slate-600"
                          : group.isUrgent
                            ? "border border-red-200 bg-red-50 text-red-700"
                            : "border border-orange-200 bg-orange-50 text-orange-700"
                      }`}
                    >
                      {group.isClosed ? "마감" : "마감 전"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                        group.isOrderCompleted
                          ? "border border-green-200 bg-green-50 text-green-700"
                          : "border border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {group.isOrderCompleted ? "주문 완료" : "주문 미완료"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeGroup ? (
        <AppModal onClose={() => setActiveModalDeadlineAt(null)}>
          <section className="mx-auto w-full max-w-xl rounded-[24px] border border-border bg-white shadow-[0_20px_48px_rgba(16,32,51,0.22)]">
            <header className="flex items-center justify-between border-b border-border/60 px-6 py-4">
              <div>
                <p className="text-base font-bold text-slate-900">주문 품목 상세</p>
                <p className="mt-1 text-xs text-slate-500">마감 시간 {activeGroup.deadlineAt}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalDeadlineAt(null)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                aria-label="팝업 닫기"
              >
                <X className="h-4 w-4" />
              </button>
            </header>
            <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
              <ul className="space-y-2">
                {activeGroup.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-border/50 bg-slate-50 px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-slate-700">{item.sku_name}</span>
                    <span
                      className={`text-xs font-semibold ${
                        item.is_ordered ? "text-green-700" : "text-red-600"
                      }`}
                    >
                      {item.is_ordered ? "주문 완료" : "주문 미완료"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </AppModal>
      ) : null}
    </section>
  );
}
