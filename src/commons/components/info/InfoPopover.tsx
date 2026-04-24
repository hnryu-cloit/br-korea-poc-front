import { useState } from "react";
import { Info } from "lucide-react";
import type { FieldCaption } from "@/commons/types/field-caption";

type Props = {
  caption: FieldCaption;
  side?: "top" | "bottom";
  align?: "left" | "right";
};

export function InfoPopover({ caption, side = "bottom", align = "left" }: Props) {
  const [open, setOpen] = useState(false);

  const verticalClass = side === "top" ? "bottom-full mb-1" : "top-full mt-1";
  const horizontalClass = align === "right" ? "right-0" : "left-0";

  return (
    <span
      className="relative inline-flex shrink-0"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span className="inline-flex cursor-pointer items-center justify-center text-slate-400 transition-colors hover:text-[#653819]">
        <Info className="h-3.5 w-3.5" />
      </span>

      {open && (
        <div
          className={`absolute ${verticalClass} ${horizontalClass} z-50 w-72 rounded-xl border border-[#DADADA] bg-white p-4 shadow-lg`}
        >
          {caption.assumption && (
            <div className="mb-3">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-[#653819]">
                전제 및 가정
              </p>
              <p className="text-[13px] leading-relaxed text-slate-600">{caption.assumption}</p>
            </div>
          )}
          {caption.formula && (
            <div className="mb-3">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-[#653819]">
                수식
              </p>
              <code className="block rounded bg-[#f8f8f8] px-2 py-1 font-mono text-[12px] leading-relaxed text-slate-700">
                {caption.formula}
              </code>
            </div>
          )}
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-[#653819]">
              설명
            </p>
            <p className="text-[13px] leading-relaxed text-slate-600">{caption.description}</p>
          </div>
        </div>
      )}
    </span>
  );
}
