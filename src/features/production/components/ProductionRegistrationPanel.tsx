import type {
  ProductionRegistrationForm,
  ProductionSkuItem,
} from "@/features/production/types/production";
import { formatCountWithUnit } from "@/commons/utils/format-count";

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

export function ProductionRegistrationPanel({
  activeSku,
  form,
  qty,
  onChangeQty,
  onSubmit,
  isSubmitting,
  onClose,
}: {
  activeSku: ProductionSkuItem;
  form?: ProductionRegistrationForm;
  qty: string;
  onChangeQty: (value: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  onClose: () => void;
}) {
  const detail = form ?? {
    sku_id: activeSku.sku_id,
    sku_name: activeSku.sku_name,
    image_url: activeSku.image_url,
    current_stock: activeSku.current_stock,
    forecast_stock_1h: activeSku.forecast_stock_1h,
    recommended_qty: activeSku.recommended_production_qty ?? activeSku.avg_first_production_qty_4w,
    chance_loss_saving_pct: activeSku.chance_loss_saving_pct,
    chance_loss_basis_text:
      activeSku.chance_loss_basis_text ??
      "산출 기준: 1시간 후 재고 소진 예측률 및 4주 평균 판매 기회 손실률 비교",
    predicted_stockout_time: activeSku.predicted_stockout_time,
    can_produce: activeSku.can_produce,
    sales_velocity: activeSku.sales_velocity,
    tags: activeSku.tags ?? [],
    alert_message: activeSku.alert_message,
    material_alert: activeSku.material_alert,
    material_alert_message: activeSku.material_alert_message,
  };
  const detailImageUrl = toAbsoluteImageUrl(detail.image_url);
  const displayImageUrl = detailImageUrl ?? MENU_PLACEHOLDER_IMAGE;

  return (
    <section className="rounded-[28px] border border-[#dbe6fb] bg-white px-6 py-6 shadow-[0_18px_36px_rgba(16,32,51,0.08)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-slate-900">생산 등록</p>
          <p className="mt-1 text-sm text-slate-500">
            추천 수량은 4주 평균 생산 패턴을 기준으로 계산했습니다.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-2xl border border-[#dce4f3] bg-[#f7faff] px-3 py-2 text-sm font-semibold text-slate-600"
        >
          닫기
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-[#f8fbff] px-4 py-4">
          <p className="text-xs font-bold text-slate-400">품목</p>
          <div className="mt-2 flex items-center gap-3">
            <img
              src={displayImageUrl}
              alt={detail.sku_name}
              className="h-14 w-14 shrink-0 rounded-xl border border-border/60 object-cover"
              onError={(event) => {
                event.currentTarget.src = MENU_PLACEHOLDER_IMAGE;
              }}
            />
            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-slate-900">{detail.sku_name}</p>
              {!detailImageUrl ? (
                <p className="mt-0.5 text-xs font-medium text-slate-400">
                  상품이미지 준비중입니다.
                </p>
              ) : null}
            </div>
          </div>
          {detail.tags?.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {detail.tags.map((tag) => (
                <span
                  key={`${detail.sku_id}-${tag}`}
                  className={`rounded-full px-2 py-1 text-[11px] font-bold ${
                    tag === "속도↑"
                      ? "border border-orange-200 bg-orange-50 text-orange-600"
                      : tag === "재료"
                        ? "border border-yellow-200 bg-yellow-50 text-yellow-700"
                        : "border border-[#dbe6fb] bg-[#edf4ff] text-[#2454C8]"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="rounded-2xl bg-[#f8fbff] px-4 py-4">
          <p className="text-xs font-bold text-slate-400">생산 수량</p>
          <input
            type="number"
            value={qty}
            onChange={(event) => onChangeQty(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-[#dce4f3] bg-white px-4 py-3 text-base font-semibold text-slate-800 outline-none focus:border-[#2454C8]"
          />
          <p className="mt-2 text-xs text-slate-500">
            추천 수량 {formatCountWithUnit(detail.recommended_qty, "개")} · 4주 평균 1차 생산 기준
          </p>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4">
          <p className="text-xs font-bold text-red-500">현재 재고 / 1시간 후 예측</p>
          <p className="mt-1 text-sm text-red-700">
            {formatCountWithUnit(detail.current_stock, "개")} →{" "}
            {formatCountWithUnit(detail.forecast_stock_1h, "개")} 예상
          </p>
          {detail.predicted_stockout_time ? (
            <p className="mt-2 text-xs text-red-500">
              예상 품절 시각 {detail.predicted_stockout_time}
            </p>
          ) : null}
        </div>
        <div className="rounded-2xl border border-[#dbe6fb] bg-[#edf4ff] px-4 py-4">
          <p className="text-xs font-bold text-[#2454C8]">찬스 로스 감소 효과</p>
          <p className="mt-1 text-sm text-slate-700">
            지금 생산 시 {detail.chance_loss_saving_pct}% 감소 예상
          </p>
          <p className="mt-2 text-xs text-slate-500">{detail.chance_loss_basis_text}</p>
          {detail.sales_velocity ? (
            <p className="mt-2 text-xs text-slate-500">
              현재 판매 속도 {detail.sales_velocity.toFixed(1)}배
            </p>
          ) : null}
        </div>
      </div>

      {detail.alert_message ? (
        <div className="mt-4 rounded-2xl border border-[#dbe6fb] bg-[#f8fbff] px-4 py-4 text-sm text-slate-700">
          {detail.alert_message}
        </div>
      ) : null}

      {detail.material_alert ? (
        <div className="mt-4 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm text-yellow-800">
          {detail.material_alert_message ??
            "재료 부족 경고가 있습니다. 생산 등록 전에 재료 주문 상태를 함께 확인하세요."}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-2xl border border-[#dce4f3] bg-[#f7faff] px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-[#eef4ff] hover:text-[#2454C8]"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={detail.can_produce === false || isSubmitting}
          className="rounded-2xl bg-[#2454C8] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1d44a8]"
        >
          {detail.can_produce === false ? "생산 불가" : isSubmitting ? "등록 중..." : "생산 등록"}
        </button>
      </div>
    </section>
  );
}
