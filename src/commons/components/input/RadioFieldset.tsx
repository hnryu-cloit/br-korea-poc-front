import { InfoPopover } from "@/commons/components/info/InfoPopover";
import type { FieldCaption } from "@/commons/types/field-caption";

type RadioOption<T extends string> = {
  label: string;
  value: T;
  caption?: FieldCaption;
};

type RadioFieldsetProps<T extends string> = {
  legend: string;
  name: string;
  value: T;
  options: RadioOption<T>[];
  onChange: (value: T) => void;
};

export function RadioFieldset<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
}: RadioFieldsetProps<T>) {
  return (
    <fieldset className="flex items-center gap-4">
      <legend className="mb-1 text-sm font-medium text-black">{legend}</legend>
      {options.map((option) => (
        <span key={option.value} className="inline-flex items-center gap-1">
          <label className="flex items-center gap-2 text-sm text-brown-700">
            <input
              type="radio"
              name={name}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            {option.label}
          </label>
          {option.caption ? (
            <InfoPopover caption={option.caption} side="bottom" align="left" />
          ) : null}
        </span>
      ))}
    </fieldset>
  );
}
