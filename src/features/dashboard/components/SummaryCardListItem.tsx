import type { SummaryCardListItemProps } from "@/features/dashboard/types/summary-card";

export function SummaryCardListItem({ title, value, description }: SummaryCardListItemProps) {
  return (
    <div className="flex flex-col items-end gap-2 rounded-lg border border-[#DADADA] bg-white p-4">
      <div className="flex w-full items-end justify-between">
        <span className="text-md font-bold text-[#2E2520]">{title}</span>
        <span className="text-md font-bold text-orange-500">{value}</span>
      </div>
      {description ? <p className="text-sm leading-5 text-[#653819]">{description}</p> : null}
    </div>
  );
}
