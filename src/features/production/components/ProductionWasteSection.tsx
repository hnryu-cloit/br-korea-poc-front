import type { WasteSummaryResponse } from "@/features/production/types/production";

type Props = {
  data?: WasteSummaryResponse;
  isLoading: boolean;
  errorMessage?: string;
};

const MENU_PLACEHOLDER_IMAGE = "/images/menu-placeholder.svg";

function resolveImageUrl(imageUrl?: string | null): string {
  if (!imageUrl) {
    return MENU_PLACEHOLDER_IMAGE;
  }
  if (imageUrl.startsWith("/static/menu-images/")) {
    return imageUrl.replace("/static/menu-images/", "/images/");
  }
  return imageUrl;
}

export function ProductionWasteSection({ data, isLoading, errorMessage }: Props) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      {isLoading ? (
        <div className="px-6 py-8 text-sm text-slate-400">조회 중...</div>
      ) : errorMessage ? (
        <div className="space-y-2 px-6 py-8 text-sm">
          <p className="font-semibold text-red-600">폐기 손실 데이터를 불러오지 못했습니다.</p>
          <p className="text-slate-500">{errorMessage}</p>
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="px-6 py-8 text-sm text-slate-400">폐기 데이터가 없습니다.</div>
      ) : (
        <div className="p-6 space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4">
              <p className="text-xs text-red-700">보정 로스 금액</p>
              <p className="text-xl font-bold text-red-600">
                {data.total_adjusted_loss_amount.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}원
              </p>
            </div>
            <div className="rounded-2xl border border-orange-100 bg-orange-50 px-5 py-4">
              <p className="text-xs text-orange-700">실폐기 금액</p>
              <p className="text-xl font-bold text-orange-600">
                {data.total_disuse_amount.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}원
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-xs text-slate-700">가설 유통기한 손실 수량</p>
              <p className="text-xl font-bold text-slate-800">
                {data.total_estimated_expiry_loss_qty.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}개
              </p>
            </div>
          </div>

          <ul className="divide-y divide-border/40 rounded-2xl border border-border/40 px-4">
            {data.items.map((item) => (
              <li key={item.item_nm} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={resolveImageUrl(item.image_url)}
                    alt={item.item_nm}
                    className="h-10 w-10 shrink-0 rounded-lg border border-border/60 object-cover"
                    onError={(event) => {
                      event.currentTarget.src = MENU_PLACEHOLDER_IMAGE;
                    }}
                  />
                  <span className="text-sm font-medium text-slate-800">{item.item_nm}</span>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <span className="text-sm text-slate-500">
                    보정 {item.adjusted_loss_qty.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}개
                  </span>
                  <span className="text-sm font-semibold text-red-600 min-w-[80px]">
                    {item.adjusted_loss_amount.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}원
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
            <p className="text-xs font-bold text-blue-700">근거</p>
            <p className="mt-1 text-sm text-blue-900">
              {String((data.evidence.summary_reason as string) || "D+1 보정 로스와 실폐기를 분리 집계")}
            </p>
            {typeof data.evidence.ai_summary === "string" && data.evidence.ai_summary.length > 0 ? (
              <p className="mt-2 text-sm text-slate-800">{data.evidence.ai_summary as string}</p>
            ) : null}
            {Array.isArray(data.evidence.ai_citations) && data.evidence.ai_citations.length > 0 ? (
              <p className="mt-1 text-xs text-slate-600">
                인용 근거: {(data.evidence.ai_citations as string[]).join(", ")}
              </p>
            ) : null}
            <p className="mt-1 text-xs text-blue-700">출처: core_stock_rate, raw_inventory_extract</p>
          </div>
        </div>
      )}
    </section>
  );
}
