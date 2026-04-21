import { Pagination } from "@/commons/components/page/Pagination";
import type {
  InventoryStatusItem,
  InventoryStatusResponse,
} from "@/features/production/types/production";

type Props = {
  data?: InventoryStatusResponse;
  isLoading: boolean;
  onChangePage?: (page: number) => void;
};

const STATUS_STYLE: Record<InventoryStatusItem["status"], string> = {
  과잉: "bg-orange-50 text-orange-600 border border-orange-200",
  부족: "bg-red-50 text-red-600 border border-red-200",
  적정: "bg-green-50 text-green-600 border border-green-200",
};

export function ProductionInventoryStatusSection({ data, isLoading, onChangePage }: Props) {
  const totalPages = data?.pagination?.total_pages ?? 1;
  const currentPage = data?.pagination?.page ?? 1;

  return (
    <section className="overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      {isLoading ? (
        <div className="px-6 py-8 text-sm text-slate-400">조회 중...</div>
      ) : !data || data.items.length === 0 ? (
        <div className="px-6 py-8 text-sm text-slate-400">재고 데이터가 없습니다.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] whitespace-nowrap text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-[#f8fbff] text-left">
                <th className="px-6 py-3 text-xs font-bold text-slate-500">품목명</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500">현재 개수</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500">판매 개수</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500">상태</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item.item_nm} className="border-b border-border/30 last:border-0">
                  <td className="px-6 py-4 font-semibold text-slate-800">{item.item_nm}</td>
                  <td className="px-6 py-4 text-slate-700">
                    {item.total_stock.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}개
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {item.total_sold.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}개
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {data?.pagination ? (
        <Pagination currentPage={currentPage} totalPages={totalPages} onChangePage={onChangePage} />
      ) : null}
    </section>
  );
}
