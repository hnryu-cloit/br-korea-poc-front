import { cn } from "@/lib/utils";

export type CheckboxFilterOption<T extends string> = {
  label: string;
  value: T;
};

type Props<T extends string> = {
  options: CheckboxFilterOption<T>[];
  selectedValues: T[];
  onChange: (selectedValues: T[]) => void;
  allLabel?: string;
  className?: string;
  selectionMode?: "multiple" | "single";
  disabled?: boolean;
};

export function CheckboxFilterGroup<T extends string>({
  options,
  selectedValues,
  onChange,
  allLabel = "전체 선택",
  className,
  selectionMode = "multiple",
  disabled = false,
}: Props<T>) {
  const allValues = options.map((option) => option.value);
  const isAllSelected =
    allValues.length > 0 && allValues.every((value) => selectedValues.includes(value));

  const handleToggleAll = () => {
    onChange(isAllSelected ? [] : allValues);
  };

  const handleToggleOption = (value: T) => {
    if (selectionMode === "single") {
      onChange([value]);
      return;
    }

    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((selectedValue) => selectedValue !== value));
      return;
    }

    onChange(
      allValues.filter(
        (optionValue) => selectedValues.includes(optionValue) || optionValue === value,
      ),
    );
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {selectionMode === "multiple" && allLabel ? (
        <FilterChip
          label={allLabel}
          checked={isAllSelected}
          onClick={handleToggleAll}
          disabled={disabled}
        />
      ) : null}
      {options.map((option) => (
        <FilterChip
          key={option.value}
          label={option.label}
          checked={selectedValues.includes(option.value)}
          onClick={() => handleToggleOption(option.value)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

function FilterChip({
  label,
  checked,
  onClick,
  disabled,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 rounded-[8px] border px-4 py-1.5 text-md font-bold transition-colors",
        checked
          ? "border-orange-500 bg-orange-500 text-white"
          : "border-[#CAC4D0] bg-white text-[#653819]",
        "disabled:opacity-50",
      )}
    >
      <span>{label}</span>
    </button>
  );
}
