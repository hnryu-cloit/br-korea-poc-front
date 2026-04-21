import type {
  InventoryStatusItem,
  InventoryStatusResponse,
} from "@/features/production/types/production";

type Props = {
  data?: InventoryStatusResponse;
  isLoading: boolean;
  errorMessage?: string;
};

const STATUS_STYLE: Record<InventoryStatusItem["status"], string> = {
  과잉: "bg-orange-50 text-orange-600 border border-orange-200",
  부족: "bg-red-50 text-red-600 border border-red-200",
  적정: "bg-green-50 text-green-600 border border-green-200",
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

export function ProductionInventoryStatusSection({ data, isLoading, errorMessage }: Props) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      {isLoading ? (
        <div className="px-6 py-8 text-sm text-slate-400">조회 중...</div>
      ) : errorMessage ? (
        <div className="space-y-2 px-6 py-8 text-sm">
          <p className="font-semibold text-red-600">재고 진단 데이터를 불러오지 못했습니다.</p>
          <p className="text-slate-500">{errorMessage}</p>
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="px-6 py-8 text-sm text-slate-400">재고 데이터가 없습니다.</div>
      ) : (
        <div className="space-y-5 p-6">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">부족 품목</p>
              <p className="text-xl font-bold text-red-600">{Number(data.summary.shortage_count || 0)}개</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">과잉 품목</p>
              <p className="text-xl font-bold text-orange-600">{Number(data.summary.excess_count || 0)}개</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">평균 재고율</p>
              <p className="text-xl font-bold text-slate-900">{Number(data.summary.avg_stock_rate || 0).toFixed(2)}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] whitespace-nowrap text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-[#f8fbff] text-left">
                  <th className="px-6 py-3 text-xs font-bold text-slate-500">품목명</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500">판매가능</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500">판매</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500">재고량</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500">재고율</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500">가설 유통기한</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500">상태</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr key={`${item.item_cd}-${item.item_nm}`} className="border-b border-border/30 last:border-0">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-3">
                        <img
                          src={resolveImageUrl(item.image_url)}
                          alt={item.item_nm}
                          className="h-10 w-10 shrink-0 rounded-lg border border-border/60 object-cover"
                          onError={(event) => {
                            event.currentTarget.src = MENU_PLACEHOLDER_IMAGE;
                          }}
                        />
                        <span>{item.item_nm}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{item.total_orderable.toLocaleString("ko-KR")}개</td>
                    <td className="px-6 py-4 text-slate-700">{item.total_sold.toLocaleString("ko-KR")}개</td>
                    <td className="px-6 py-4 text-slate-700">{item.total_stock.toLocaleString("ko-KR")}개</td>
                    <td className="px-6 py-4 text-slate-700">{item.stock_rate.toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-700">{item.assumed_shelf_life_days}일</td>
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

          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
            <p className="text-xs font-bold text-blue-700">근거</p>
            <p className="mt-1 text-sm text-blue-900">
              {String((data.evidence.summary_reason as string) || "재고율/품절시간 기반 진단")}
            </p>
            {typeof data.evidence.ai_summary === "string" && data.evidence.ai_summary.length > 0 ? (
              <p className="mt-2 text-sm text-slate-800">{data.evidence.ai_summary as string}</p>
            ) : null}
            {Array.isArray(data.evidence.ai_citations) && data.evidence.ai_citations.length > 0 ? (
              <p className="mt-1 text-xs text-slate-600">
                인용 근거: {(data.evidence.ai_citations as string[]).join(", ")}
              </p>
            ) : null}
            <p className="mt-1 text-xs text-blue-700">출처: core_stock_rate, core_stockout_time</p>
          </div>
        </div>
      )}
    </section>
  );
}
