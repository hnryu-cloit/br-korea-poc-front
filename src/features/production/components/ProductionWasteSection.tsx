import { InfoPopover } from "@/commons/components/info/InfoPopover";
import { FIELD_CAPTIONS } from "@/commons/constants/field-captions";
import { Pagination } from "@/commons/components/page/Pagination";
import { ProductionWasteTableSkeleton } from "@/features/production/components/ProductionSkeletons";
import type { WasteSummaryResponse } from "@/features/production/types/production";
import ProductDefaultImage from "@/assets/default_product_img.svg";

type Props = {
  data?: WasteSummaryResponse;
  isLoading: boolean;
  onChangePage?: (page: number) => void;
  errorMessage?: string;
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:6002").replace(
  /\/$/,
  "",
);

function resolveImageUrl(imageUrl?: string | null): string {
  if (!imageUrl) {
    return ProductDefaultImage;
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

export function ProductionWasteSection({ data, isLoading, onChangePage, errorMessage }: Props) {
  const totalPages = data?.pagination?.total_pages ?? 1;
  const currentPage = data?.pagination?.page ?? 1;

  return (
    <section className="overflow-hidden">
      <div className="flex flex-col gap-10">
        <div className="overflow-x-auto border border-[#DADADA] rounded-[4px]">
          <table className="w-full min-w-[1080px] whitespace-nowrap text-sm">
            <thead>
              <tr className="border-b border-[#DADADA] bg-[#FFD9C780]">
                <th className="px-4 py-2.5 text-[14px] font-bold text-[#653819] text-left">
                  품목명
                </th>
                <th className="px-6 py-2.5 text-[14px] font-bold text-[#653819] text-right">
                  <span className="inline-flex items-center justify-end gap-1">
                    <span>폐기한 갯수</span>
                    <InfoPopover
                      caption={FIELD_CAPTIONS["production:waste_qty"]}
                      side="bottom"
                      align="right"
                    />
                  </span>
                </th>
                <th className="px-6 py-2.5 text-[14px] font-bold text-[#653819] text-right">
                  <span className="inline-flex items-center justify-end gap-1">
                    <span>판매가</span>
                    <InfoPopover
                      caption={FIELD_CAPTIONS["production:waste_unit_price"]}
                      side="bottom"
                      align="right"
                    />
                  </span>
                </th>
                <th className="px-6 py-2.5 text-[14px] font-bold text-[#653819] text-right">
                  <span className="inline-flex items-center justify-end gap-1">
                    <span>손실 금액</span>
                    <InfoPopover
                      caption={FIELD_CAPTIONS["production:waste_loss_amount"]}
                      side="bottom"
                      align="right"
                    />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <ProductionWasteTableSkeleton />
              ) : errorMessage ? (
                <tr>
                  <td
                    colSpan={4}
                    className="bg-white px-6 py-16 text-center text-sm text-brown-700"
                  >
                    {errorMessage}
                  </td>
                </tr>
              ) : data?.items.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="bg-white px-6 py-16 text-center text-sm text-slate-400"
                  >
                    표시할 폐기 손실 데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                data?.items.map((sku) => {
                  const imageUrl = resolveImageUrl(sku.image_url);
                  const displayImageUrl = imageUrl ?? ProductDefaultImage;
                  return (
                    <tr
                      key={sku.item_nm}
                      className="bg-white border-b border-[#DADADAS] text-brown-700 text-md font-regular"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={displayImageUrl}
                            alt={sku.item_nm}
                            className="h-10 w-10 shrink-0 object-cover"
                            onError={(event) => {
                              event.currentTarget.src = ProductDefaultImage;
                            }}
                          />
                          <div className="min-w-0">
                            <div className="">{sku.item_nm}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {sku.confirmed_disuse_qty.toLocaleString("ko-KR")}개
                      </td>
                      <td className="px-6 py-4 text-right">
                        {sku.confirmed_disuse_qty > 0
                          ? `${Math.round(sku.disuse_amount / sku.confirmed_disuse_qty).toLocaleString("ko-KR")}원`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {sku.disuse_amount.toLocaleString("ko-KR")}원
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {data?.pagination ? (
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
