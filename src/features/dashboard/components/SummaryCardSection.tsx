import type { SummaryCardSectionProps } from "@/features/dashboard/types/summary-card";

export function SummaryCardSection({ title, action, children }: SummaryCardSectionProps) {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[18px] leading-[29.88px] font-bold text-brown-700">{title}</p>
        {action}
      </div>
      {children}
    </section>
  );
}
