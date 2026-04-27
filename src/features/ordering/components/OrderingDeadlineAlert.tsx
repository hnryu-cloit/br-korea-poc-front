import { useMemo, useState } from "react";

import { Pagination } from "@/commons/components/page/Pagination";
import type { OrderingDeadlineItem } from "@/features/ordering/types/ordering";

const TABLE_HEADERS = ["품목명", "주문 마감 시간", "주문 완료 여부"] as const;

function getStatusChipClassName(isOrdered: boolean) {
  return isOrdered ? "border-[#00BBA7] text-[#00BBA7]" : "border-[#EB198D] text-[#EB198D]";
}

export function OrderingDeadlineAlert({
  deadlineItems,
}: {
  deadlineItems?: OrderingDeadlineItem[];
}) {
  const pageSize = 5;
  const items = useMemo(() => deadlineItems ?? [], [deadlineItems]);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const [currentPage, setCurrentPage] = useState(1);
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const pagedItems = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safeCurrentPage]);

  return (
    <section className="overflow-hidden rounded-[6px] border border-t-4 border-[#FFD9C7] bg-white p-6">
      <h3 className="text-md font-bold leading-9 text-black mb-4">주문 마감 임박 (1시간 이내)</h3>

      {items.length === 0 ? (
        <div className="px-6 py-10 text-[18px] font-medium text-[#655770]">
          주문 마감이 임박한 상품이 없습니다.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border">
            <table className="w-full min-w-[960px] table-fixed border-collapse">
              <colgroup>
                <col className="w-[56%]" />
                <col className="w-[24%]" />
                <col className="w-[20%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-[#DADADA] bg-[#FFD9C7]/50">
                  {TABLE_HEADERS.map((header) => (
                    <th
                      key={header}
                      className="px-4 py-2.5 text-left text-sm font-bold leading-7 text-[#653819]"
                    >
                      <div className="flex items-center gap-3">
                        <span>{header}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedItems.map((item) => (
                  <tr key={item.id} className="border-b border-[#D4D4D4] last:border-b-0">
                    <td className="px-3 py-2 text-md leading-7 text-brown-700">
                      <span className="block truncate">{item.sku_name}</span>
                    </td>
                    <td className="px-3 py-2 text-md leading-7 text-brown-700">
                      {item.deadline_at}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex rounded-[24px] border px-2 py-1 text-sm font-bold leading-7 ${getStatusChipClassName(item.is_ordered)}`}
                      >
                        {item.is_ordered ? "주문 완료" : "주문 미완료"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onChangePage={setCurrentPage}
          />
        </>
      )}
    </section>
  );
}
