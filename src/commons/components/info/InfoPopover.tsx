import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";
import type { FieldCaption } from "@/commons/types/field-caption";
import { parseCaptionLines } from "@/commons/components/info/parse-caption-lines";

type Props = {
  caption: FieldCaption;
  side?: "top" | "bottom";
  align?: "left" | "right";
};

const POPOVER_WIDTH = 288; // w-72
const INDENT_PIXEL = 12; // 한 단계 들여쓰기 폭

function CaptionBody({ raw }: { raw: string }) {
  const lines = parseCaptionLines(raw);
  const baseClass = "text-[13px] leading-relaxed text-slate-600";

  return (
    <div className={`flex flex-col gap-1 ${baseClass}`}>
      {lines.map((line, idx) => {
        if (line.kind === "bullet") {
          return (
            <div
              key={idx}
              className="flex gap-1.5"
              style={{ paddingLeft: `${line.level * INDENT_PIXEL}px` }}
            >
              <span className="shrink-0 text-slate-400">•</span>
              <span className="flex-1 break-words">{line.text}</span>
            </div>
          );
        }
        if (line.kind === "dash") {
          return (
            <div
              key={idx}
              className="flex gap-1.5"
              style={{ paddingLeft: `${line.level * INDENT_PIXEL + INDENT_PIXEL}px` }}
            >
              <span className="shrink-0 text-slate-400">–</span>
              <span className="flex-1 break-words">{line.text}</span>
            </div>
          );
        }
        if (!line.text.trim()) {
          return <div key={idx} className="h-1" />;
        }
        return (
          <p key={idx} className="break-words">
            {line.text}
          </p>
        );
      })}
    </div>
  );
}

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
                <CaptionBody raw={caption.assumption} />
              </div>
            )}
            {caption.formula && (
              <div className="mb-3">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-[#653819]">
                  수식
                </p>
                <div className="rounded bg-[#f8f8f8] px-2 py-1.5">
                  <CaptionBody raw={caption.formula} />
                </div>
              </div>
            )}
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-[#653819]">
                설명
              </p>
              <CaptionBody raw={caption.description} />
            </div>
          </div>,
          document.body,
        )}
    </span>
  );
}
