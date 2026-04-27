import { Send } from "lucide-react";

import { InfoPopover } from "@/commons/components/info/InfoPopover";
import { FIELD_CAPTIONS } from "@/commons/constants/field-captions";
import { useFloatingAiChat } from "@/commons/hooks/useFloatingAiChat";
import type { SummaryCardProps } from "@/features/dashboard/types/summary-card";

export function SummaryCard({
  icon,
  title,
  captionKey,
  domain,
  recommendedQuestions,
  children,
}: SummaryCardProps) {
  const caption = captionKey ? FIELD_CAPTIONS[captionKey] : null;
  const { openWithPrompt } = useFloatingAiChat();

  return (
    <article className="rounded-[8px] border border-[#DADADA] bg-white p-6">
      <div className="flex items-center gap-[4px]">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center">{icon}</div>
        <h2 className="text-[24px] leading-[1.66] font-semibold tracking-[-0.02em] text-brown-700">
          {title}
        </h2>
        {caption && <InfoPopover caption={caption} side="bottom" align="left" />}
      </div>

      <div className="mt-4 border-t border-[#DADADA] pt-5">
        <div className="flex items-center justify-between">
          <p className="text-[18px] leading-[1.66] font-bold tracking-[-0.02em] text-brown-700">
            AI 추천 질문
          </p>
        </div>

        <div className="mt-3 space-y-2">
          {recommendedQuestions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => openWithPrompt(question, domain)}
              className="flex w-full min-h-12 items-center justify-between gap-4 rounded-[8px] border border-[#DADADA] bg-white px-4 py-3 transition-colors hover:bg-[#FFFCF8]"
            >
              <span className="text-[16px] leading-6 font-bold tracking-[-0.02em] text-[#66290C] text-left">
                {question}
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[#7C4117]">
                <Send className="h-4 w-4" />
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-[#DADADA] pt-5">{children}</div>
    </article>
  );
}
