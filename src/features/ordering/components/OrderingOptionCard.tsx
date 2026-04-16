import { formatCountWithUnit } from "@/commons/utils/format-count";
import type { OrderingOption } from "@/features/ordering/types/ordering";

export function OrderingOptionCard({
  option,
  selected,
  onSelect,
}: {
  option: OrderingOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      className={`rounded-[28px] border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)] transition-all ${
        selected ? "border-[#2454C8] ring-1 ring-[#2454C8]/20" : "border-border hover:border-[#bfd1ed]"
      }`}
    >
      <button type="button" className="w-full text-left" onClick={onSelect}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-slate-900">{option.title}</p>
            <p className="mt-1 text-xs font-semibold text-slate-400">{option.basis}</p>
          </div>
          {option.recommended ? (
            <span className="rounded-full bg-[#2454C8] px-3 py-1 text-xs font-bold text-white">AI 추천</span>
          ) : null}
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-500">{option.description}</p>

        <div className="mt-4 space-y-2">
          {option.items.map((item) => (
            <div key={`${option.option_id}-${item.sku_name}`} className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-3 py-2.5 text-sm">
              <span className="text-slate-600">{item.sku_name}</span>
              <span className="font-bold text-slate-800">{formatCountWithUnit(item.quantity, "개")}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-[#edf4ff] px-4 py-4">
          <p className="text-xs font-bold text-[#2454C8]">추천 근거</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{option.reasoning_text}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {option.reasoning_metrics.map((metric) => (
              <div key={metric.key} className="rounded-2xl bg-white px-3 py-3">
                <p className="text-[11px] font-semibold text-slate-400">{metric.key}</p>
                <p className="mt-1 text-sm font-bold text-slate-900">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>

        {option.special_factors.length ? (
          <div className="mt-4">
            <p className="text-xs font-bold text-slate-500">예외 변수 반영</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {option.special_factors.map((factor) => (
                <span key={factor} className="rounded-full border border-[#dce4f3] bg-[#f7faff] px-3 py-1 text-[11px] font-semibold text-slate-600">
                  {factor}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </button>
    </article>
  );
}
