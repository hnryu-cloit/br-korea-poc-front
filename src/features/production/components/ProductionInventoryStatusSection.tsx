import { CardAiButton } from "@/commons/components/chat/CardAiButton";
import type { InventoryStatusItem, InventoryStatusResponse } from "@/features/production/types/production";

type Props = {
  data?: InventoryStatusResponse;
  isLoading: boolean;
};

const STATUS_STYLE: Record<InventoryStatusItem["status"], string> = {
  과잉: "bg-orange-50 text-orange-600 border border-orange-200",
  부족: "bg-red-50 text-red-600 border border-red-200",
  적정: "bg-green-50 text-green-600 border border-green-200",
};

export function ProductionInventoryStatusSection({ data, isLoading }: Props) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="border-b border-border/60 px-6 py-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-slate-900">재고 수준 진단</p>
            <p className="mt-1 text-sm text-slate-500">품목별 현재 재고와 판매량 비교를 통해 적정 재고 수준을 진단합니다.</p>
          </div>
          <CardAiButton contextKey="production:inventory-status" />
        </div>
      </div>

      {isLoading ? (
        <div className="px-6 py-8 text-sm text-slate-400">조회 중...</div>
      ) : !data || data.items.length === 0 ? (
        <div className="px-6 py-8 text-sm text-slate-400">재고 데이터가 없습니다.</div>
      ) : (
        <ul className="divide-y divide-border/40 px-6">
          {data.items.map((item) => (
            <li key={item.item_nm} className="flex items-center justify-between py-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-slate-800">{item.item_nm}</span>
                <span className="text-xs text-slate-400">
                  현재 {item.total_stock.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}개
                  &nbsp;·&nbsp;
                  판매 {item.total_sold.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}개
                </span>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[item.status]}`}>
                {item.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}