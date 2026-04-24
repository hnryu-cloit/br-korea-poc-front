import { InfoPopover } from "@/commons/components/info/InfoPopover";
import { FIELD_CAPTIONS } from "@/commons/constants/field-captions";
import type { SummaryCardSectionProps } from "@/features/dashboard/types/summary-card";

export function SummaryCardSection({ title, captionKey, action, children }: SummaryCardSectionProps) {
  const caption = captionKey ? FIELD_CAPTIONS[captionKey] : null;

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          <p className="text-[18px] leading-[29.88px] font-bold text-brown-700">{title}</p>
          {caption && <InfoPopover caption={caption} side="bottom" align="left" />}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
