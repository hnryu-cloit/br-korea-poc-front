import type { WasteSummaryResponse } from "@/features/production/types/production";

type Props = {
  data?: WasteSummaryResponse;
  isLoading: boolean;
};

export function ProductionWasteSection({ data, isLoading }: Props) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      {isLoading ? (
        <div className="px-6 py-8 text-sm text-slate-400">조회 중...</div>
      ) : !data || data.items.length === 0 ? (
        <div className="px-6 py-8 text-sm text-slate-400">폐기 데이터가 없습니다.</div>
      ) : (
        <div className="p-6 space-y-4">
          <div className="rounded-2xl bg-red-50 border border-red-100 px-5 py-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-red-700">총 손실 금액</span>
            <span className="text-xl font-bold text-red-600">
              {data.total_loss_amount.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}원
            </span>
          </div>

          <ul className="divide-y divide-border/40">
            {data.items.map((item) => (
              <li key={item.item_nm} className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-slate-800">{item.item_nm}</span>
                <div className="flex items-center gap-4 text-right">
                  <span className="text-sm text-slate-500">
                    {item.total_disuse_qty.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}개
                  </span>
                  <span className="text-sm font-semibold text-red-600 min-w-[80px]">
                    {item.loss_amount.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}원
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
