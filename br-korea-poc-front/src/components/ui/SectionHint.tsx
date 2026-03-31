import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

type Question = {
  q: string;
  a: string;
  data?: string[];
};

type Props = {
  questions: Question[];
};

export function SectionHint({ questions }: Props) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const toggle = () => {
    setOpen((v) => !v);
    setActiveIdx(null);
  };

  const selectQ = (idx: number) => {
    setActiveIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
          open
            ? "bg-[#2454C8] text-white"
            : "border border-[#dce4f3] bg-[#f7faff] text-slate-500 hover:border-[#bfd1ed] hover:text-[#2454C8]"
        }`}
        aria-label="도움말"
      >
        <HelpCircle className="h-3.5 w-3.5" />
        <span>궁금한 점</span>
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      {open ? (
        <div className="absolute right-0 top-10 z-30 w-72 overflow-hidden rounded-2xl border border-[#d8e5ff] bg-white shadow-[0_16px_40px_rgba(31,77,187,0.16)]">
          <div className="border-b border-[#eef4ff] bg-[#f7faff] px-4 py-3">
            <p className="text-xs font-bold text-slate-700">이런 게 궁금하신가요?</p>
          </div>
          <div className="p-3 space-y-2">
            {questions.map((item, idx) => (
              <div key={idx}>
                <button
                  type="button"
                  onClick={() => selectQ(idx)}
                  className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    activeIdx === idx
                      ? "bg-[#2454C8] text-white"
                      : "bg-[#f8fbff] text-slate-700 hover:bg-[#eef4ff]"
                  }`}
                >
                  {item.q}
                </button>
                {activeIdx === idx ? (
                  <div className="mt-2 rounded-xl border border-[#d8e5ff] bg-white px-4 py-3 text-sm leading-6 text-slate-700">
                    <p>{item.a}</p>
                    {item.data ? (
                      <div className="mt-3 space-y-1.5">
                        {item.data.map((d) => (
                          <div key={d} className="rounded-lg bg-[#f8fbff] px-3 py-2 text-xs text-slate-500">
                            {d}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}