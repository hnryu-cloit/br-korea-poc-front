import type { OrderingHistoryResponse } from "@/features/ordering/types/ordering";

type Props = {
  data?: OrderingHistoryResponse;
  isLoading: boolean;
};

export function OrderingHistorySection({ data, isLoading }: Props) {
  const autoPercent = data ? Math.round(data.auto_rate * 100) : 0;
  const manualPercent = data ? Math.round(data.manual_rate * 100) : 0;

  return (
    <section className="rounded-[24px] border border-border bg-white px-6 py-6 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
      <h2 className="mb-5 text-lg font-bold text-slate-900">발주 이력</h2>

      {isLoading ? (
        <div className="flex items-center justify-center py-10 text-sm text-slate-400">
          불러오는 중...
        </div>
      ) : !data || data.total_count === 0 ? (
        <div className="flex items-center justify-center py-10 text-sm text-slate-400">
          발주 이력이 없습니다
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
              <span>자동 발주</span>
              <span>{autoPercent}%</span>
            </div>
            <div className="mb-1 h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${autoPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm font-medium text-slate-600">
              <span>수동 발주</span>
              <span>{manualPercent}%</span>
            </div>
            <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-slate-400 transition-all"
                style={{ width: `${manualPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">
              전체 {data.total_count.toLocaleString()}건 기준
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                  <th className="pb-2 pr-4 font-medium">납품일</th>
                  <th className="pb-2 pr-4 font-medium">품목명</th>
                  <th className="pb-2 pr-4 text-right font-medium">발주량</th>
                  <th className="pb-2 pr-4 text-right font-medium">확정량</th>
                  <th className="pb-2 font-medium">발주유형</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-50 last:border-0"
                  >
                    <td className="py-2 pr-4 text-slate-600">
                      {item.dlv_dt ?? "-"}
                    </td>
                    <td className="py-2 pr-4 font-medium text-slate-800">
                      {item.item_nm}
                    </td>
                    <td className="py-2 pr-4 text-right tabular-nums text-slate-600">
                      {item.ord_qty != null ? item.ord_qty.toLocaleString() : "-"}
                    </td>
                    <td className="py-2 pr-4 text-right tabular-nums text-slate-600">
                      {item.confrm_qty != null ? item.confrm_qty.toLocaleString() : "-"}
                    </td>
                    <td className="py-2">
                      {item.is_auto ? (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                          자동
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                          수동
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}