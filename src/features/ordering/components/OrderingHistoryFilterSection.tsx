type Props = {
  dateFrom: string;
  dateTo: string;
  itemName: string;
  orderType: "all" | "auto" | "manual";
  onDateFromChange: (v: string) => void;
  onDateToChange: (v: string) => void;
  onItemNameChange: (v: string) => void;
  onOrderTypeChange: (v: "all" | "auto" | "manual") => void;
};

export function OrderingHistoryFilterSection({
  dateFrom,
  dateTo,
  itemName,
  orderType,
  onDateFromChange,
  onDateToChange,
  onItemNameChange,
  onOrderTypeChange,
}: Props) {
  return (
    <section className="rounded-[24px] border border-border bg-white px-6 py-5 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
      <div className="grid gap-3 md:grid-cols-5">
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
          시작일
          <input
            type="date"
            value={dateFrom}
            onChange={(event) => onDateFromChange(event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
          종료일
          <input
            type="date"
            value={dateTo}
            onChange={(event) => onDateToChange(event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500 md:col-span-2">
          품목명
          <input
            type="text"
            value={itemName}
            onChange={(event) => onItemNameChange(event.target.value)}
            placeholder="예: 초코, 아메리카노"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
          발주유형
          <select
            value={orderType}
            onChange={(event) => onOrderTypeChange(event.target.value as "all" | "auto" | "manual")}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
          >
            <option value="all">전체</option>
            <option value="auto">자동</option>
            <option value="manual">수동</option>
          </select>
        </label>
      </div>
    </section>
  );
}
