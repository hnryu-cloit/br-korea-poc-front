import arrow_down from "@/assets/arrow_red.svg";
import ProductDefaultImage from "@/assets/default_product_img.svg";
import { InfoPopover } from "@/commons/components/info/InfoPopover";
import { Pagination } from "@/commons/components/page/Pagination";
import { FIELD_CAPTIONS } from "@/commons/constants/field-captions";
import { formatCountWithUnit } from "@/commons/utils/format-count";
import { getPublickProductImage } from "@/commons/utils/getPublicProductImage";
import { ProductionTableRowsSkeleton } from "@/features/production/components/ProductionSkeletons";
import { StatusBadge } from "@/features/production/components/StatusBadge";
import type {
  ProductionSkuItem,
  ProductionSkuListResponse,
} from "@/features/production/types/production";

export function ProductionTableSection({
  items,
  pagination,
  onChangePage,
  onOpenRegister,
  loading,
}: {
  items: ProductionSkuItem[];
  pagination?: ProductionSkuListResponse["pagination"];
  onChangePage?: (page: number) => void;
  onOpenRegister: (sku: ProductionSkuItem) => void;
  loading?: boolean;
}) {
  const totalPages = pagination?.total_pages ?? 1;
  const currentPage = pagination?.page ?? 1;

  return (
    <section className="overflow-hidden">
      <div className="flex flex-col gap-10">
        <div className="overflow-x-auto border border-[#DADADA] rounded-[4px]">
          <table className="w-full min-w-[1080px] whitespace-nowrap text-sm">
            <thead>
              <tr className="border-b border-[#DADADA] bg-[#FFD9C780] text-left">
                <th className="px-4 py-2.5 text-[14px] font-bold text-[#653819]">품목명</th>
                <th className="px-6 py-2.5 text-[14px] font-bold text-[#653819]">상태</th>
                <th className="px-4 py-2.5 text-[14px] font-bold text-[#653819]">현재 재고</th>
                <th className="px-4 py-2.5 text-[14px] font-bold text-[#653819]">
                  <span className="inline-flex items-center gap-1">
                    <span>1시간 후 예측 재고</span>
                    <InfoPopover
                      caption={FIELD_CAPTIONS["production:forecast_1h"]}
                      side="bottom"
                      align="left"
                    />
                  </span>
                </th>
                <th className="px-4 py-2.5 text-[14px] font-bold text-[#653819]">
                  <span className="inline-flex items-center gap-1">
                    <span>찬스 로스 절감</span>
                    <InfoPopover
                      caption={FIELD_CAPTIONS["production:chance_loss"]}
                      side="bottom"
                      align="right"
                    />
                  </span>
                </th>
                <th className="px-4 py-2.5 text-[14px] font-bold text-[#653819]"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <ProductionTableRowsSkeleton />
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="bg-white px-6 py-16 text-center text-sm text-slate-400"
                  >
                    표시할 SKU 데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                items.map((sku) => {
                  const imageUrl = getPublickProductImage(sku.image_url);
                  return (
                    <tr
                      key={sku.sku_id}
                      className={`border-b border-[#DADADA] bg-white last:border-0 ${sku.status === "danger" ? "bg-red-50/30" : "hover:bg-[#f8fbff]"}`}
                    >
                      <td className="px-4 py-4 font-semibold text-slate-800">
                        <div className="flex items-center gap-3">
                          <img
                            src={imageUrl}
                            alt={sku.sku_name}
                            className="h-10 w-10 shrink-0 object-cover"
                            onError={(event) => {
                              const target = event.currentTarget;
                              if (target.dataset.fallbackApplied === "1") return;
                              target.dataset.fallbackApplied = "1";
                              target.src = ProductDefaultImage;
                            }}
                          />
                          <div className="min-w-0">
                            <div className="text-[#41352E] text-md font-regular">
                              {sku.sku_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={sku.status} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-brown-700">
                          {formatCountWithUnit(sku.current_stock, "개")}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-brown-700">
                          {formatCountWithUnit(sku.forecast_stock_1h, "개")}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-brown-700 text-md flex items-center gap-2">
                          <img src={arrow_down} alt="Arrow Down" />
                          <span>{sku.chance_loss_saving_pct.toLocaleString("ko-kr")}원</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenRegister(sku)}
                            disabled={sku.can_produce === false}
                            className="bg-orange-500 text-[14px] rounded-[4px] p-[2px_12px] font-bold text-white h-8"
                          >
                            {sku.can_produce === false ? "생산 불가" : "생산하기"}
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChangePage={onChangePage}
          />
        ) : null}
      </div>
    </section>
  );
}
