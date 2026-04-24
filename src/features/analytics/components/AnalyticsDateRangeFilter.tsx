function DateField({ value, disabled = false }: { value: string; disabled?: boolean }) {
  return (
    <label className="relative block">
      <input
        type="date"
        value={value}
        disabled={disabled}
        readOnly
        className="h-8 w-full rounded-[4px] border border-[#DADADA] bg-white p-[6px_12px] text-sm font-medium text-[#45556C] outline-none transition-colors [color-scheme:light] focus:border-[#653819] disabled:cursor-not-allowed disabled:bg-[#F5F5F5] disabled:text-[#A8A8A8]"
      />
    </label>
  );
}

export const AnalyticsDateRangeFilter = ({
  dateFrom,
  dateTo,
}: {
  dateFrom: string;
  dateTo: string;
}) => {
  return (
    <section className="rounded-[16px] border border-[#DADADA] bg-white px-6 py-5">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-black">시작일</p>
          <DateField value={dateFrom} disabled />
        </div>

        <div className="text-sm text-black">~</div>

        <div className="flex flex-col gap-1">
          <p className="text-sm text-black">종료일</p>
          <DateField value={dateTo} disabled />
        </div>
      </div>
    </section>
  );
};
