import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface HintItem {
  q: string;
  a: string;
}

interface SectionHintProps {
  questions: HintItem[];
}

export function SectionHint({ questions }: SectionHintProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-2 space-y-1">
      {questions.map((item, i) => (
        <div key={i} className="rounded-md border border-slate-100 bg-slate-50 text-xs">
          <button
            className="flex w-full items-center gap-1.5 px-3 py-2 text-left text-slate-500 hover:text-slate-700"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <HelpCircle className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="flex-1">{item.q}</span>
            {openIndex === i ? (
              <ChevronUp className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 shrink-0" />
            )}
          </button>
          {openIndex === i && (
            <p className="px-3 pb-2.5 pt-0 text-slate-500 leading-relaxed">{item.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}