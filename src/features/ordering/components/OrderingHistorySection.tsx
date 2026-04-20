import { useMemo, useState } from "react";

import type { OrderingHistoryResponse } from "@/features/ordering/types/ordering";

type Props = {
  data?: OrderingHistoryResponse;
  isLoading: boolean;
};

export function OrderingHistorySection({ data, isLoading }: Props) {
  const autoPercent = data ? Math.round(data.auto_rate * 100) : 0;
  const manualPercent = data ? Math.round(data.manual_rate * 100) : 0;
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const selectedItem = useMemo(() => {
    if (!data || data.items.length === 0) {
      return null;
    }
    return data.items[Math.min(selectedIndex, data.items.length - 1)];
  }, [data, selectedIndex]);

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
                  <th className="pb-2 pr-4 text-right font-medium">괴리율</th>
                  <th className="pb-2 font-medium">발주유형</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, idx) => {
                  const gapPct =
                    item.ord_qty && item.ord_qty > 0 && item.confrm_qty != null
                      ? Math.round((Math.abs(item.confrm_qty - item.ord_qty) / item.ord_qty) * 100)
                      : null;
                  return (
                    <tr
                      key={idx}
                      className={`cursor-pointer border-b border-slate-50 last:border-0 ${
                        selectedIndex === idx ? "bg-blue-50/40" : ""
                      }`}
                      onClick={() => setSelectedIndex(idx)}
                    >
                      <td className="py-2 pr-4 text-slate-600">{item.dlv_dt ?? "-"}</td>
                      <td className="py-2 pr-4 font-medium text-slate-800">
                        <span>{item.item_nm}</span>
                        {item.ord_grp_nm ? (
                          <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                            {item.ord_grp_nm}
                          </span>
                        ) : null}
                      </td>
                      <td className="py-2 pr-4 text-right tabular-nums text-slate-600">
                        {item.ord_qty != null ? item.ord_qty.toLocaleString() : "-"}
                      </td>
                      <td className="py-2 pr-4 text-right tabular-nums text-slate-600">
                        {item.confrm_qty != null ? item.confrm_qty.toLocaleString() : "-"}
                      </td>
                      <td className="py-2 pr-4 text-right">
                        {gapPct != null ? (
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                              gapPct >= 30
                                ? "bg-red-50 text-red-600"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {gapPct}%
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
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
                  );
                })}
              </tbody>
            </table>
          </div>
          {selectedItem ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-[#f8fbff] px-4 py-4">
              <p className="mb-3 text-xs font-semibold text-slate-500">선택 이력 상세</p>
              <p className="mb-3 text-sm font-bold text-slate-800">
                {selectedItem.item_nm}
                {selectedItem.ord_grp_nm ? (
                  <span className="ml-2 text-xs font-normal text-slate-400">{selectedItem.ord_grp_nm}</span>
                ) : null}
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-center">
                  <p className="text-[10px] text-slate-400">발주량</p>
                  <p className="mt-1 text-base font-bold text-slate-800">{selectedItem.ord_qty ?? "-"}개</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-center">
                  <p className="text-[10px] text-slate-400">확정량</p>
                  <p className="mt-1 text-base font-bold text-slate-800">{selectedItem.confrm_qty ?? "-"}개</p>
                </div>
                <div className={`rounded-xl border px-3 py-2.5 text-center ${
                  selectedItem.ord_qty && selectedItem.confrm_qty != null &&
                  Math.round((Math.abs(selectedItem.confrm_qty - selectedItem.ord_qty) / Math.max(selectedItem.ord_qty, 1)) * 100) >= 30
                    ? "border-red-200 bg-red-50"
                    : "border-slate-200 bg-white"
                }`}>
                  <p className="text-[10px] text-slate-400">괴리율</p>
                  <p className={`mt-1 text-base font-bold ${
                    selectedItem.ord_qty && selectedItem.confrm_qty != null &&
                    Math.round((Math.abs(selectedItem.confrm_qty - selectedItem.ord_qty) / Math.max(selectedItem.ord_qty, 1)) * 100) >= 30
                      ? "text-red-600"
                      : "text-slate-800"
                  }`}>
                    {selectedItem.ord_qty && selectedItem.ord_qty > 0 && selectedItem.confrm_qty != null
                      ? `${Math.round((Math.abs(selectedItem.confrm_qty - selectedItem.ord_qty) / selectedItem.ord_qty) * 100)}%`
                      : "-"}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                {selectedItem.is_auto ? "자동 발주" : "수동 발주"} · 납품일 {selectedItem.dlv_dt ?? "-"}
              </p>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}