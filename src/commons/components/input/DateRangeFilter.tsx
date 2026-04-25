function DateField({
  value,
  onChange,
  disabled = false,
  readOnly = false,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
}) {
  return (
    <label className="relative block">
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        readOnly={readOnly}
        className="h-8 w-full rounded-[4px] border border-[#DADADA] bg-white p-[6px_12px] text-sm font-medium text-[#45556C] outline-none transition-colors [color-scheme:light] focus:border-[#653819] disabled:cursor-not-allowed disabled:bg-[#F5F5F5] disabled:text-[#A8A8A8]"
      />
    </label>
  );
}

export const DateRangeFilter = ({
  dateFrom,
  dateTo,
  onChangeDateFrom,
  onChangeDateTo,
  showDateTo = true,
  dateFromDisabled = false,
  dateToDisabled = false,
  readOnly = false,
}: {
  dateFrom: string;
  dateTo: string;
  onChangeDateFrom: (value: string) => void;
  onChangeDateTo: (value: string) => void;
  showDateTo?: boolean;
  dateFromDisabled?: boolean;
  dateToDisabled?: boolean;
  readOnly?: boolean;
}) => {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-black">시작일</p>
        <DateField
          value={dateFrom}
          onChange={onChangeDateFrom}
          disabled={dateFromDisabled}
          readOnly={readOnly}
        />
      </div>

      {showDateTo ? (
        <>
          <div className="text-sm text-black">~</div>

          <div className="flex flex-col gap-1">
            <p className="text-sm text-black">종료일</p>
            <DateField
              value={dateTo}
              onChange={onChangeDateTo}
              disabled={dateToDisabled}
              readOnly={readOnly}
            />
          </div>
        </>
      ) : null}
    </div>
  );
};
