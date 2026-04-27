import ProductDefaultImage from "@/assets/default_product_img.svg";
import { CheckboxFilterGroup } from "@/commons/components/filter/CheckboxFilterGroup";
import { InfoPopover } from "@/commons/components/info/InfoPopover";
import { Pagination } from "@/commons/components/page/Pagination";
import { FIELD_CAPTIONS } from "@/commons/constants/field-captions";
import { ProductionInventoryStatusSkeleton } from "@/features/production/components/ProductionSkeletons";
import type {
  InventoryStatusItem,
  InventoryStatusResponse,
} from "@/features/production/types/production";

type Props = {
  data?: InventoryStatusResponse;
  isLoading: boolean;
  selectedStatuses: InventoryStatusItem["status"][];
  onChangeStatuses: (statuses: InventoryStatusItem["status"][]) => void;
  onChangePage?: (page: number) => void;
  isError?: boolean;
  currentPage: number;
};

const STATUS_STYLE: Record<InventoryStatusItem["status"], string> = {
  여유: "bg-white text-[#00BBA7] border border-[#00BBA7]",
  부족: "bg-white text-[#FF671F] border border-[#FF671F]",
  적정: "bg-white text-[#2B7FFF] border border-[#2B7FFF]",
};

const ITEM_GROUP_BADGE_STYLE: Record<string, string> = {
  도넛: "border border-pink-200 bg-pink-50 text-pink-700",
  베이커리: "border border-orange-200 bg-orange-50 text-orange-700",
  커피: "border border-brown-200 bg-brown-50 text-brown-700",
  음료: "border border-blue-200 bg-blue-50 text-blue-700",
  기타: "border border-slate-200 bg-slate-50 text-slate-600",
  "원재료/소모품": "border border-emerald-200 bg-emerald-50 text-emerald-700",
  "RTD/패키지": "border border-purple-200 bg-purple-50 text-purple-700",
};

const STATUS_FILTER_OPTIONS: {
  label: string;
  value: InventoryStatusItem["status"];
}[] = [
  { label: "여유", value: "여유" },
  { label: "부족", value: "부족" },
  { label: "적정", value: "적정" },
];

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

function getItemGroupBadgeStyle(itemGroup: string): string {
  return ITEM_GROUP_BADGE_STYLE[itemGroup] ?? "border border-slate-200 bg-slate-50 text-slate-600";
}

export function ProductionInventoryStatusSection(props: Props) {
  const {
    data,
    isLoading,
    selectedStatuses,
    onChangeStatuses,
    onChangePage,
    isError,
    currentPage,
  } = props;
  const totalPages = data?.pagination?.total_pages ?? 1;

  return (
    <section className="overflow-hidden">
      <div className="flex flex-col gap-10">
        <CheckboxFilterGroup
          options={STATUS_FILTER_OPTIONS}
          selectedValues={selectedStatuses}
          onChange={onChangeStatuses}
          allLabel="전체 선택"
          disabled={isLoading}
        />
        {isLoading ? (
          <ProductionInventoryStatusSkeleton />
        ) : (
          <div className="overflow-x-auto border border-[#DADADA] rounded-[4px]">
            <table className="w-full min-w-[1080px] table-fixed whitespace-nowrap text-sm">
              <colgroup>
                <col className="w-[42%]" />
                <col className="w-[18%]" />
                <col className="w-[14%]" />
                <col className="w-[14%]" />
                <col className="w-[12%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-[#DADADA] bg-[#FFD9C780]">
                  <th className="px-4 py-2.5 text-[14px] font-bold text-[#653819] text-left">
                    품목명
                  </th>
                  <th className="px-6 py-2.5 text-[14px] font-bold text-[#653819] text-left">
                    상품 카테고리
                  </th>
                  <th className="px-6 py-2.5 text-[14px] font-bold text-[#653819] text-right">
                    <span className="inline-flex items-center gap-1">
                      <span>판매 가능 수량</span>
                      <InfoPopover
                        caption={FIELD_CAPTIONS["inventory:orderable_qty"]}
                        side="bottom"
                        align="left"
                      />
                    </span>
                  </th>
                  <th className="px-6 py-2.5 text-[14px] font-bold text-[#653819] text-right">
                    <span className="inline-flex items-center gap-1">
                      <span>판매 개수</span>
                      <InfoPopover
                        caption={FIELD_CAPTIONS["inventory:sold_qty"]}
                        side="bottom"
                        align="right"
                      />
                    </span>
                  </th>
                  <th className="px-6 py-2.5 text-[14px] font-bold text-[#653819] text-right">
                    <span className="inline-flex items-center gap-1">
                      <span>상태</span>
                      <InfoPopover
                        caption={FIELD_CAPTIONS["inventory:status"]}
                        side="bottom"
                        align="right"
                      />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isError ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="bg-white px-6 py-16 text-center text-sm text-brown-700"
                    >
                      재고 현황 데이터를 불러오는데 문제가 발생했습니다.
                    </td>
                  </tr>
                ) : data?.items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="bg-white px-6 py-16 text-center text-sm text-brown-700"
                    >
                      표시할 재고 현황 데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  data?.items.map((sku) => {
                    const imageUrl = resolveImageUrl(sku.image_url);
                    const displayImageUrl = imageUrl ?? ProductDefaultImage;
                    return (
                      <tr
                        key={sku.item_nm}
                        className="border-b border-[#DADADA] bg-white text-sm text-brown-700"
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
                              <div className="truncate">{sku.item_nm}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {sku.item_group ? (
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${getItemGroupBadgeStyle(
                                sku.item_group,
                              )}`}
                            >
                              {sku.item_group}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {sku.total_orderable.toLocaleString("ko-KR")}개
                        </td>
                        <td className="px-6 py-4 text-right">
                          {sku.total_sold.toLocaleString("ko-KR")}개
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 font-bold ${STATUS_STYLE[sku.status]}`}
                          >
                            {sku.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
        {!!data?.items.length && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChangePage={onChangePage}
          />
        )}
      </div>
    </section>
  );
}
