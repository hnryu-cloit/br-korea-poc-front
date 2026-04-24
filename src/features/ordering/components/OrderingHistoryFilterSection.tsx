type Props = {
  dateFrom: string;
  dateTo: string;
  itemName: string;
  onDateFromChange: (v: string) => void;
  onDateToChange: (v: string) => void;
  onItemNameChange: (v: string) => void;
  onConfirm: () => void;
};

export function OrderingHistoryFilterSection({
  dateFrom,
  dateTo,
  itemName,
  onDateFromChange,
  onDateToChange,
  onItemNameChange,
  onConfirm,
}: Props) {
  return (
    <section className="rounded-[16px] border border-border bg-white px-6 py-5 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
      <div className="flex items-end gap-4 justify-between">
        <label className="flex flex-col gap-1 text-xs text-#000 flex-1 ">
          시작일
          <input
            type="date"
            value={dateFrom}
            onChange={(event) => onDateFromChange(event.target.value)}
            className="rounded-[4px] border border-[#CAD5E2] px-3 py-1.5 text-sm text-[#1D293D] h-8"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-#000 flex-1">
          종료일
          <input
            type="date"
            value={dateTo}
            onChange={(event) => onDateToChange(event.target.value)}
            className="rounded-[4px] border border-[#CAD5E2] px-3 py-1.5 text-sm text-[#1D293D] h-8"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-#000 flex-1">
          품목명
          <input
            type="text"
            value={itemName}
            onChange={(event) => onItemNameChange(event.target.value)}
            placeholder="예: 초코, 아메리카노"
            className="rounded-[4px] border border-[#CAD5E2] px-3 py-1.5 text-sm text-[#1D293D] h-8"
          />
        </label>
        <button
          type="button"
          onClick={onConfirm}
          className="bg-[linear-gradient(90deg,#FF6E00_0%,#DA1884_100%)] h-8 rounded-[4px] p-[2px_12px] text-sm font-bold text-white w-[49px]"
        >
          확인
        </button>
      </div>
    </section>
  );
}
