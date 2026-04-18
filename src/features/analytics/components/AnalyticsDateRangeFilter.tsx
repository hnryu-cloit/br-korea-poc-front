export const AnalyticsDateRangeFilter = ({
  dateFrom,
  dateTo,
  onChangeDateFrom,
  onChangeDateTo,
}: {
  dateFrom: string;
  dateTo: string;
  onChangeDateFrom: (value: string) => void;
  onChangeDateTo: (value: string) => void;
}) => {
  return (
    <section className="rounded-[24px] border border-border bg-white px-5 py-4 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-slate-800">조회 기간</p>
          <p className="mt-1 text-xs text-slate-400">
            선택 기간과 직전 동기간을 비교해 지표를 계산합니다.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500">시작일</span>
            <input
              type="date"
              value={dateFrom}
              max={dateTo}
              onChange={(event) => onChangeDateFrom(event.target.value)}
              className="h-10 w-full rounded-xl border border-[#dce4f3] bg-[#f7faff] px-3 text-sm text-slate-700 focus:border-primary focus:outline-none"
            />
          </label>
          <label className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500">종료일</span>
            <input
              type="date"
              value={dateTo}
              min={dateFrom}
              onChange={(event) => onChangeDateTo(event.target.value)}
              className="h-10 w-full rounded-xl border border-[#dce4f3] bg-[#f7faff] px-3 text-sm text-slate-700 focus:border-primary focus:outline-none"
            />
          </label>
        </div>
      </div>
    </section>
  );
};
