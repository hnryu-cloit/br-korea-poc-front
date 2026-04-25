import arrow_down from "@/assets/arrow_red.svg";
import ProductDefaultImage from "@/assets/default_product_img.svg";
import { Pagination } from "@/commons/components/page/Pagination";
import { formatCountWithUnit } from "@/commons/utils/format-count";
import { StatusBadge } from "@/features/production/components/StatusBadge";
import type {
  ProductionSkuItem,
  ProductionSkuListResponse,
} from "@/features/production/types/production";

const TABLE_HEADS = [
  "품목명",
  "재고 상태",
  "현재 재고",
  "1시간 후 예측 재고",
  "찬스 로스 절감",
  "",
];

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:6002").replace(
  /\/$/,
  "",
);

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
  orderingDeadlineAt,
  onChangePage,
  onOpenRegister,
  loading,
}: {
  items: ProductionSkuItem[];
  pagination?: ProductionSkuListResponse["pagination"];
  orderingDeadlineAt?: string;
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
                {TABLE_HEADS.map((el) => (
                  <th key={el} className="px-4 py-2.5 text-[14px] font-bold text-[#653819]">
                    {el}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="bg-white px-6 py-16 text-center text-sm text-slate-400"
                  >
                    SKU 데이터를 불러오는 중입니다.
                  </td>
                </tr>
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
                  const imageUrl = toAbsoluteImageUrl(sku.image_url);
                  const displayImageUrl = imageUrl ?? ProductDefaultImage;
                  return (
                    <tr
                      key={sku.sku_id}
                      className={`border-b border-[#DADADA] bg-white last:border-0 ${sku.status === "danger" ? "bg-red-50/30" : "hover:bg-[#f8fbff]"}`}
                    >
                      <td className="px-4 py-4 font-semibold text-slate-800">
                        <div className="flex items-center gap-3">
                          <img
                            src={displayImageUrl}
                            alt={sku.sku_name}
                            className="h-10 w-10 shrink-0 object-cover"
                            onError={(event) => {
                              event.currentTarget.src = ProductDefaultImage;
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
                          <span>{sku.chance_loss_saving_pct}%</span>
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
