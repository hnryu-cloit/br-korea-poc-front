import arrow_red from "@/assets/arrow_red.svg";
import type {
  ProductionRegistrationForm,
  ProductionSkuItem,
} from "@/features/production/types/production";
import { X } from "lucide-react";

const TABLE_HEADS = ["현재 재고", "1시간 동안 판매될 예상 갯수", "예상 품절 시간"];

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

  return (
    <section className="rounded-[28px] border border-[#dbe6fb] bg-white shadow-[0_18px_36px_rgba(16,32,51,0.08)]">
      <div className="flex items-center justify-between p-6 border-b border-[#CAD5E2]">
        <p className="text-[#1E1E1E] font-semibold text-2xl">{detail.sku_name} 생산하기</p>
        <button onClick={onClose}>
          <X className="text-[#45556C] h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-col gap-4 p-6">
        <div className="rounded-[16px] border border-[#FB2C36] bg-[#FEF2F24D] p-4 flex flex-col gap-3">
          <p className="text-[#FB2C36] text-sm">
            ⚠️ 1시간 이내 품절 위험 상품입니다. 즉시 생산여부를 확인하세요.
          </p>
          <div className="border border-[#DADADAS] w-[70%]">
            <table className="borer border-[#DADADA] rounded-[4px] w-full">
              <thead>
                <tr className="border-b border-[#DADADA] bg-[#FFD9C780] text-left">
                  {TABLE_HEADS.map((el) => (
                    <th key={el} className="px-4 py-2.5 text-[14px] font-bold text-[#653819]">
                      {el}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="text-brown-700 bg-white text-md">
                  <td className="px-4 py-3">{detail.current_stock}개</td>
                  <td className="px-4 py-3">{detail.forecast_stock_1h}개</td>
                  <td className="px-4 py-3">1시간 이내</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-[#F8FAFC] rounded-[12px] p-4 flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <p className="text-brown-700 font-bold text-md">생산수량</p>
            <input
              type="number"
              value={qty}
              onChange={(event) => onChangeQty(event.target.value)}
              className="rounded-[4px] px-3 py-1.5 text-[#1D293D] text-sm border border-[#CAD5E2] bg-white w-[50%]"
            />
          </div>
          <div className="rounded-[16px] bg-white p-4 flex flex-col gap-4 shadow-[0px_2px_4px_0px_rgba(50,56,62,0.08)]">
            <div className="flex items-center gap-2">
              <div className="w-fit rounded-[24px] border-[1px] border-transparent bg-[linear-gradient(#fff,#fff),linear-gradient(180deg,#FF6E00_0%,#DA1884_100%)] [background-origin:border-box] [background-clip:padding-box,border-box] px-6 py-1">
                <span className="bg-gradient-to-b from-[#FF6E00] to-[#DA1884] bg-clip-text text-sm font-bold text-transparent">
                  추천 수량 : {detail.recommended_qty}개
                </span>
              </div>
            </div>
            <div className="border border-[#DADADA] px-6 py-3 flex items-stretch gap-6 rounded-[8px] w-fit">
              <div className="flex flex-col gap-4 text-brown-700 text-md">
                <p className="font-bold text-sm">
                  최근 4주 1차 생산량 ({activeSku.avg_first_production_time_4w}AM)
                </p>
                <p>평균 {activeSku.avg_first_production_qty_4w}개</p>
              </div>

              <div className="w-[1px] self-stretch bg-[#DADADA]" />

              <div className="flex flex-col gap-4 text-brown-700 text-md">
                <p className="font-bold text-sm">
                  최근 4주 2차 생산량 ({activeSku.avg_second_production_time_4w}PM)
                </p>
                <p>평균 {activeSku.avg_second_production_qty_4w}개</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border border-[#00D492] rounded-[16px] p-4 bg-[#F0FDFA] flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <p className="text-brown-700 font-bold text-sm">지금 생산 시, 찬스 로스 감소 효과</p>
          </div>
          <div className="flex items-center gap-2">
            <img src={arrow_red} className="" />
            <p className="text-brown-700 text-md">{detail.chance_loss_saving_pct}% 감소 예상</p>
            {detail.sales_velocity && (
              <p className="border border-[#00BBA7] bg-white text-[#00BBA7] text-sm rounded-[24px] px-2 py-1">
                현재 판매 속도 {detail.sales_velocity.toFixed(1)}배
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="px-[22px] py-[14px] flex justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
          className="h-10 px-4 py-1 rounded-[4px] border border-[#CAD5E2] text-[#1D293D] font-bold text-sm"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={detail.can_produce === false || isSubmitting}
          className=" h-10 px-4 py-1 rounded-[4px] bg-[#1447E6] text-white font-bold text-sm"
        >
          {detail.can_produce === false ? "생산 불가" : "생산하기"}
        </button>
      </div>
    </section>
  );
}
