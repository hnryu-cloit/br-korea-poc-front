import type { StoreOrderItem } from "@/features/admin/hq-coaching/types/hq-coaching";

const statusConfig = {
  normal: { label: "정상", className: "bg-green-50 text-green-600 border border-green-100" },
  review: {
    label: "검토 필요",
    className: "bg-orange-50 text-orange-600 border border-orange-100",
  },
  risk: { label: "미완료", className: "bg-red-50 text-red-600 border border-red-100" },
};

type Props = {
  storeOrders: StoreOrderItem[];
  isLoading: boolean;
};

export function HQCoachingOrdersTableSection({ storeOrders, isLoading }: Props) {
  return (
    <section className="rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)] overflow-hidden">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-base font-semibold text-slate-900">매장별 주문 현황</p>
        <p className="text-xs text-slate-400 mt-0.5">오늘 주문 마감 기준</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-[#f8fbff]">
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                매장
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                선택 옵션
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                기준
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                점주 사유
              </th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                등록 시각
              </th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                상태
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                  불러오는 중...
                </td>
              </tr>
            ) : storeOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                  데이터가 없어요.
                </td>
              </tr>
            ) : (
              storeOrders.map((store) => {
                const cfg = statusConfig[store.status];
                return (
                  <tr
                    key={store.store}
                    className={`border-b border-border/30 last:border-0 ${store.status === "risk" ? "bg-red-50/30" : "hover:bg-[#f8fbff]"}`}
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{store.store}</p>
                      <p className="text-xs text-slate-400">{store.region}</p>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-700">{store.option}</td>
                    <td className="px-4 py-4 text-slate-500">{store.basis}</td>
                    <td className="px-4 py-4 text-slate-500">{store.reason}</td>
                    <td className="px-4 py-4 text-center text-slate-500">{store.submitted_at}</td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.className}`}
                      >
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
