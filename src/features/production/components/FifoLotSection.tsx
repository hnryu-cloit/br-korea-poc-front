import { CheckboxFilterGroup } from "@/commons/components/filter/CheckboxFilterGroup";
import { InfoPopover } from "@/commons/components/info/InfoPopover";
import { Pagination } from "@/commons/components/page/Pagination";
import { FIELD_CAPTIONS } from "@/commons/constants/field-captions";
import { FifoLotSkeleton } from "@/features/production/components/ProductionSkeletons";
import type {
  FifoLotItem,
  FifoLotSummaryResponse,
  FifoLotType,
} from "@/features/production/types/production";

type Props = {
  data?: FifoLotSummaryResponse;
  isLoading: boolean;
  selectedLotTypes: FifoLotFilterValue[];
  onChangeLotTypes: (types: FifoLotFilterValue[]) => void;
  onChangePage: (page: number) => void;
  currentPage: number;
  periodDescription: string;
};

type FifoLotFilterValue = Exclude<FifoLotType, undefined>;

const LOT_TYPE_TABS: { label: string; value: FifoLotFilterValue }[] = [
  { label: "완제품", value: "production" },
  { label: "납품(원재료)", value: "delivery" },
];

const LOT_TYPE_LABEL: Record<FifoLotItem["lot_type"], string> = {
  production: "완제품",
  delivery: "납품",
};

export function FifoLotSection({
  data,
  isLoading,
  selectedLotTypes,
  onChangeLotTypes,
  onChangePage,
  currentPage,
  periodDescription,
}: Props) {
  const summary = data?.summary;
  const totalPages = data?.pagination?.total_pages ?? 1;
  const isEmptySelection = selectedLotTypes.length === 0;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5">
            <h3 className="text-[18px] font-bold text-[#41352E]">이월 재고 FIFO 추적</h3>
            <InfoPopover
              caption={FIELD_CAPTIONS["fifo:section_title"]}
              side="bottom"
              align="left"
            />
          </span>
          <p className="text-sm text-slate-500">{periodDescription}</p>
        </div>

        <CheckboxFilterGroup
          options={LOT_TYPE_TABS}
          selectedValues={selectedLotTypes}
          onChange={onChangeLotTypes}
          disabled={isLoading}
        />
      </div>

      {isLoading ? (
        <FifoLotSkeleton />
      ) : (
        <>
          {summary && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <SummaryCard label="전체 품목" value={summary.total_items} unit="종" />
              <SummaryCard
                label="폐기 발생 품목"
                value={summary.items_with_waste}
                unit="종"
                color="danger"
              />
              <SummaryCard
                label="총 폐기 수량"
                value={summary.total_wasted_qty}
                unit="개"
                color="danger"
              />
              <SummaryCard
                label="잔여 활성 수량"
                value={summary.total_active_qty}
                unit="개"
                color="safe"
              />
            </div>
          )}

          <div className="overflow-x-auto rounded-[4px] border border-[#DADADA]">
            <table className="w-full min-w-[900px] whitespace-nowrap text-sm">
              <thead>
                <tr className="border-b border-[#DADADA] bg-[#FFD9C780]">
                  <th className="px-4 py-2.5 text-left text-[14px] font-bold text-[#653819]">
                    품목명
                  </th>
                  <th className="px-4 py-2.5 text-center text-[14px] font-bold text-[#653819]">
                    유형
                  </th>
                  <th className="px-4 py-2.5 text-center text-[14px] font-bold text-[#653819]">
                    유통기한
                  </th>
                  <th className="px-4 py-2.5 text-right text-[14px] font-bold text-[#653819]">
                    <span className="inline-flex items-center gap-1">
                      <span>입고 수량</span>
                      <InfoPopover
                        caption={FIELD_CAPTIONS["fifo:initial_qty"]}
                        side="top"
                        align="left"
                      />
                    </span>
                  </th>
                  <th className="px-4 py-2.5 text-right text-[14px] font-bold text-[#653819]">
                    <span className="inline-flex items-center gap-1">
                      <span>소진 수량</span>
                      <InfoPopover
                        caption={FIELD_CAPTIONS["fifo:consumed_qty"]}
                        side="top"
                        align="left"
                      />
                    </span>
                  </th>
                  <th className="px-4 py-2.5 text-right text-[14px] font-bold text-[#653819]">
                    <span className="inline-flex items-center gap-1">
                      <span>폐기 수량</span>
                      <InfoPopover
                        caption={FIELD_CAPTIONS["fifo:wasted_qty"]}
                        side="top"
                        align="right"
                      />
                    </span>
                  </th>
                  <th className="px-4 py-2.5 text-right text-[14px] font-bold text-[#653819]">
                    <span className="inline-flex items-center gap-1">
                      <span>잔여 수량</span>
                      <InfoPopover
                        caption={FIELD_CAPTIONS["fifo:active_remaining"]}
                        side="top"
                        align="right"
                      />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isEmptySelection || !data?.items.length ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="bg-white px-6 py-16 text-center text-sm text-slate-400"
                    >
                      표시할 Lot 데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  data.items.map((item, idx) => (
                    <tr
                      key={`${item.item_nm}-${item.lot_type}-${idx}`}
                      className="border-b border-[#DADADA] bg-white text-sm"
                    >
                      <td className="px-4 py-3 font-medium text-[#41352E]">{item.item_nm}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex rounded-full bg-[#FFF0E8] px-2 py-0.5 text-xs font-medium text-[#FF671F]">
                          {LOT_TYPE_LABEL[item.lot_type]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-[#653819]">
                        {item.shelf_life_days != null ? `${item.shelf_life_days}일` : "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {item.total_initial_qty.toLocaleString("ko-KR")}
                      </td>
                      <td className="px-4 py-3 text-right text-[#2B7FFF]">
                        {item.total_consumed_qty.toLocaleString("ko-KR")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={item.total_wasted_qty > 0 ? "text-[#FF671F] font-medium" : ""}
                        >
                          {item.total_wasted_qty.toLocaleString("ko-KR")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={
                            item.active_remaining_qty > 0
                              ? "text-[#00BBA7] font-medium"
                              : "text-slate-400"
                          }
                        >
                          {item.active_remaining_qty.toLocaleString("ko-KR")}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!!data?.items.length && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onChangePage={onChangePage} />
      )}
    </section>
  );
}

function SummaryCard({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  color?: "danger" | "safe";
}) {
  const valueColor =
    color === "danger" ? "text-[#FF671F]" : color === "safe" ? "text-[#00BBA7]" : "text-[#41352E]";

  return (
    <div className="rounded-lg border border-[#DADADA] bg-white px-4 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 text-xl font-bold ${valueColor}`}>
        {value.toLocaleString("ko-KR")}
        <span className="ml-1 text-sm font-normal text-slate-500">{unit}</span>
      </p>
    </div>
  );
}
