import { CheckCircle } from "lucide-react";

import { PageHero } from "@/commons/components/page/page-layout";
import type { OrderingOption } from "@/features/ordering/types/ordering";

export function OrderingConfirmedSummary({
  option,
  reason,
}: {
  option: OrderingOption;
  reason: string;
}) {
  return (
    <div className="space-y-6">
      <PageHero title="주문이 완료되었습니다." description="점주가 직접 확정한 주문안이 저장되었습니다." />
      <section className="rounded-[28px] border border-green-200 bg-green-50 px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-white p-3 text-green-600">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-green-800">주문 내역</p>
            <p className="mt-1 text-sm text-green-700">{option.title} 기준으로 주문을 확정했습니다.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {option.items.map((item) => (
                <div key={`${option.option_id}-${item.sku_name}`} className="rounded-2xl bg-white px-4 py-4 shadow-sm">
                  <p className="text-xs font-semibold text-slate-400">{item.sku_name}</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">{item.quantity}개</p>
                </div>
              ))}
            </div>
            {reason ? (
              <div className="mt-4 rounded-2xl bg-white px-4 py-4 text-sm text-slate-600">
                <p className="text-xs font-bold text-slate-400">선택 사유</p>
                <p className="mt-1">{reason}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
