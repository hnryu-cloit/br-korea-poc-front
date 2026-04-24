import { InfoPopover } from "@/commons/components/info/InfoPopover";
import { Pagination } from "@/commons/components/page/Pagination";
import { FIELD_CAPTIONS } from "@/commons/constants/field-captions";
import type { OrderingHistoryResponse } from "@/features/ordering/types/ordering";

type Props = {
  data?: OrderingHistoryResponse;
  isLoading: boolean;
  currentPage: number;
  onChangePage: (page: number) => void;
};

export function OrderingHistorySection({ data, isLoading, currentPage, onChangePage }: Props) {
  return (
    <section className="rounded-[6px] border border-[#DADADA] bg-white p-2">
      <div className="mb-5 flex items-center gap-2">
        <h2 className="text-lg font-bold text-slate-900">발주 이력</h2>
        <p className="text-xs text-slate-400">(총 {data?.total_count.toLocaleString()}건)</p>
      </div>

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
          <div className="overflow-x-auto border border-[#DADADA rounded-[4px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#DADADA] bg-[#FFD9C7]/50">
                  {(["납품일", "품목명", "발주량", "확정량"] as const).map((header) => (
                    <th
                      key={header}
                      className="px-4 py-2.5 text-left text-sm font-bold leading-7 text-[#653819]"
                    >
                      <div className="flex items-center gap-3">
                        <span>{header}</span>
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-2.5 text-left text-sm font-bold leading-7 text-[#653819]">
                    <span className="inline-flex items-center gap-1">
                      <span>괴리율</span>
                      <InfoPopover caption={FIELD_CAPTIONS["ordering:gap_rate"]} side="bottom" align="left" />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, idx) => {
                  const gapPct =
                    item.ord_qty && item.ord_qty > 0 && item.confrm_qty != null
                      ? Math.round((Math.abs(item.confrm_qty - item.ord_qty) / item.ord_qty) * 100)
                      : null;
                  return (
                    <tr key={idx} className="border-b border-slate-50 last:border-0">
                      <td className="py-1 px-4 text-brown-700">{item.dlv_dt ?? "-"}</td>
                      <td className="py-1 px-4 text-brown-700">
                        <span>{item.item_nm}</span>
                      </td>
                      <td className="py-1 px-4 text-brown-700">
                        {item.ord_qty != null ? item.ord_qty.toLocaleString() : "-"}
                      </td>
                      <td className="py-1 px-4 text-brown-700">
                        {item.confrm_qty != null ? item.confrm_qty.toLocaleString() : "-"}
                      </td>
                      <td className="py-2 pr-4">
                        {gapPct != null ? (
                          <span
                            className={`py-1 px-2 text-sm font-bold text-[#7B7B7B] border border-[#7B7B7B] rounded-[24px] leading-[142%]`}
                          >
                            {gapPct}%
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination
              currentPage={data?.page ?? currentPage}
              totalPages={data?.total_pages ?? 1}
              onChangePage={onChangePage}
            />
          </div>
        </>
      )}
    </section>
  );
}
