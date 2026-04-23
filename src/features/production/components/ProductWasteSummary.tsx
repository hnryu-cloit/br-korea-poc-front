import deleteIcon from "@/assets/delete_red.svg";
import type { WasteMonthlyTopItem } from "../types/production";

interface Props {
  totalDisuseAmount?: number;
  montlyTopItems?: WasteMonthlyTopItem[];
}

export const ProductWasteSummary = ({ totalDisuseAmount, montlyTopItems }: Props) => {
  const hasTopItems = (montlyTopItems?.length ?? 0) > 0;

  return (
    <div className="flex flex-col gap-4 overflow-hidden rounded-[6px] border border-[#FFD9C7] border-t-[4px] bg-white p-[24px] lg:flex-row lg:items-start lg:justify-between">
      <div className="shrink-0 flex flex-col gap-3 text-[#0F172B] font-bold text-md">
        <span>총 손실 금액</span>
        <span className="text-[#C10007] font-medium text-2xl">
          {totalDisuseAmount?.toLocaleString("ko-kr") ?? 0}원
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-[8px] bg-[#DADADA]/20 px-6 py-3">
        <span className="font-bold text-brown-700 text-sm">월간 최다 폐기 품목 TOP 3</span>
        {hasTopItems ? (
          <div className="flex min-w-0 flex-col gap-3 xl:flex-row">
            {montlyTopItems?.map((item, index) => (
              <WasteItem key={item.item_nm} item={item} rank={index + 1} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[64px] items-center justify-center rounded-[8px] border border-dashed border-[#D8CBC3] bg-white px-4 py-3 text-center text-sm font-medium text-[#8E7B71]">
            일간 최대 폐기 품목 데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

const WasteItem = ({ item, rank }: { item: WasteMonthlyTopItem; rank: number }) => {
  return (
    <div
      className={`flex min-w-0 flex-1 items-center justify-between rounded-[16px] border bg-white px-2.5 py-4 ${rank === 1 ? "border-[#E7000B]" : rank === 2 ? "border-[#FF6467]" : "border-[#FFC9C9]"}`}
    >
      <div className="min-w-0 truncate text-sm font-bold text-brown-700">
        {rank}. {item.item_nm}
      </div>
      <div className="ml-3 flex shrink-0 items-center gap-2 text-sm font-bold text-[#E7000B]">
        <img src={deleteIcon} className="w-6 h-6" />
        <span>{item.confirmed_disuse_qty}개</span>
      </div>
    </div>
  );
};
