import { useState } from "react";
import { HelpCircle, X } from "lucide-react";

type SectionHintQuestion = {
  q: string;
  a: string;
};

export function SectionHint({ questions }: { questions: SectionHintQuestion[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="도움말 보기"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dce4f3] bg-white text-slate-500 transition-colors hover:border-[#bfd1ed] hover:text-[#2454C8]"
      >
        {open ? <X className="h-4 w-4" /> : <HelpCircle className="h-4 w-4" />}
      </button>

      {open ? (
        <div className="absolute right-0 top-12 z-20 w-80 rounded-3xl border border-[#dbe6fb] bg-white p-4 shadow-[0_16px_40px_rgba(16,32,51,0.12)]">
          <p className="text-sm font-bold text-slate-900">도움말</p>
          <div className="mt-3 space-y-3">
            {questions.map((item) => (
              <div key={item.q} className="rounded-2xl bg-[#f8fbff] px-4 py-3">
                <p className="text-sm font-semibold text-slate-700">{item.q}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
