import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";
import type { FieldCaption } from "@/commons/types/field-caption";

type Props = {
  caption: FieldCaption;
  side?: "top" | "bottom";
  align?: "left" | "right";
};

const POPOVER_WIDTH = 288; // w-72

export function InfoPopover({ caption, side = "bottom", align = "left" }: Props) {
  const iconRef = useRef<HTMLSpanElement>(null);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (!iconRef.current) return;
    const rect = iconRef.current.getBoundingClientRect();
    const top = side === "top" ? rect.top - 4 : rect.bottom + 4;
    const left = align === "right" ? rect.right - POPOVER_WIDTH : rect.left;
    const transform = side === "top" ? "translateY(-100%)" : undefined;
    setPopoverStyle({ position: "fixed", top, left, transform });
  }, [side, align]);

  const handleMouseLeave = useCallback(() => {
    setPopoverStyle(null);
  }, []);

  return (
    <span
      ref={iconRef}
      className="inline-flex shrink-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="inline-flex cursor-pointer items-center justify-center text-slate-400 transition-colors hover:text-[#653819]">
        <Info className="h-3.5 w-3.5" />
      </span>

      {popoverStyle !== null &&
        createPortal(
          <div
            className="z-[9999] w-72 rounded-xl border border-[#DADADA] bg-white p-4 shadow-lg"
            style={popoverStyle}
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
          </div>,
          document.body,
        )}
    </span>
  );
}