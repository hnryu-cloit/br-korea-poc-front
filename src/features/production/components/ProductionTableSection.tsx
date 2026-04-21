import { ImageOff } from "lucide-react";

import { Pagination } from "@/commons/components/page/Pagination";
import { formatCountWithUnit } from "@/commons/utils/format-count";
import { StatusBadge } from "@/features/production/components/StatusBadge";
import type {
  ProductionSkuItem,
  ProductionSkuListResponse,
} from "@/features/production/types/production";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:6002").replace(
  /\/$/,
  "",
);
const MENU_PLACEHOLDER_IMAGE = "/images/menu-placeholder.svg";

function toAbsoluteImageUrl(imageUrl?: string | null): string | null {
  if (!imageUrl) {
    return null;
  }
  const normalized = imageUrl.startsWith("/static/menu-images/")
    ? imageUrl.replace("/static/menu-images/", "/images/")
    : imageUrl;
  if (normalized.startsWith("/images/")) {
    return normalized;
  }
  if (normalized.startsWith("images/")) {
    return `/${normalized}`;
  }
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }
  return `${API_BASE_URL}${normalized.startsWith("/") ? "" : "/"}${normalized}`;
}

export function ProductionTableSection({
  items,
  pagination,
  onChangePage,
  onOpenRegister,
}: {
  items: ProductionSkuItem[];
  pagination?: ProductionSkuListResponse["pagination"];
  onChangePage?: (page: number) => void;
  onOpenRegister: (sku: ProductionSkuItem) => void;
}) {
  const totalPages = pagination?.total_pages ?? 1;
  const currentPage = pagination?.page ?? 1;

  return (
    <section className="overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] whitespace-nowrap text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-[#f8fbff] text-left">
              <th className="px-4 py-3 text-xs font-bold text-slate-500">품목명</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500">주문 마감 시간</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500">상태</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500">현재 재고</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500">1시간 후 예측</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500">4주 평균 1차</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500">4주 평균 2차</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500">찬스 로스 절감</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500"></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-16 text-center text-sm text-slate-400">
                  표시할 SKU 데이터가 없습니다.
                </td>
              </tr>
            ) : (
              items.map((sku) => {
                const imageUrl = toAbsoluteImageUrl(sku.image_url);
                const displayImageUrl = imageUrl ?? MENU_PLACEHOLDER_IMAGE;
                return (
                  <tr
                    key={sku.sku_id}
                    className={`border-b border-border/30 last:border-0 ${sku.status === "danger" ? "bg-red-50/30" : "hover:bg-[#f8fbff]"}`}
                  >
                    <td className="px-4 py-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-3">
                        <img
                          src={displayImageUrl}
                          alt={sku.sku_name}
                          className="h-12 w-12 shrink-0 rounded-xl border border-border/60 object-cover"
                          onError={(event) => {
                            event.currentTarget.src = MENU_PLACEHOLDER_IMAGE;
                          }}
                        />
                        <div className="min-w-0">
                          <div className="truncate">{sku.sku_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">00:00</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={sku.status} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-bold text-slate-900">
                        {formatCountWithUnit(sku.current_stock, "개")}
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-[#2454C8]"
                          style={{ width: `${Math.min((sku.current_stock / 60) * 100, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`font-bold ${sku.status === "danger" ? "text-red-600" : sku.status === "warning" ? "text-orange-600" : "text-green-600"}`}
                      >
                        {formatCountWithUnit(sku.forecast_stock_1h, "개")}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-800">
                        {formatCountWithUnit(sku.avg_first_production_qty_4w, "개")}
                      </div>
                      <div className="text-xs text-slate-400">
                        {sku.avg_first_production_time_4w}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-800">
                        {formatCountWithUnit(sku.avg_second_production_qty_4w, "개")}
                      </div>
                      <div className="text-xs text-slate-400">
                        {sku.avg_second_production_time_4w}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-bold text-[#2454C8]">-{sku.chance_loss_saving_pct}%</div>
                      <div className="mt-1 text-[11px] text-slate-400">
                        {sku.chance_loss_basis_text ?? "1시간 후 재고 예측 및 4주 평균 손실률 기준"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenRegister(sku)}
                          disabled={sku.can_produce === false}
                          className={`rounded-2xl px-4 py-2 text-sm font-bold transition-colors ${
                            sku.can_produce === false
                              ? "cursor-not-allowed bg-slate-100 text-slate-400"
                              : sku.status === "danger"
                                ? "bg-[#2454C8] text-white hover:bg-[#1d44a8]"
                                : "border border-[#dce4f3] bg-[#f7faff] text-slate-700 hover:bg-[#eef4ff] hover:text-[#2454C8]"
                          }`}
                        >
                          {sku.can_produce === false ? "생산 불가" : "생산"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {pagination ? (
        <Pagination currentPage={currentPage} totalPages={totalPages} onChangePage={onChangePage} />
      ) : null}
    </section>
  );
}
