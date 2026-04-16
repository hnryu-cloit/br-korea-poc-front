import type { SalesInsightSection } from "@/features/sales/types/sales";

export const SalesV2InsightsSection = ({
  sections,
  isLoading,
}: {
  sections: SalesInsightSection[];
  isLoading: boolean;
}) => (
  <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
    {sections.map((section) => (
      <article
        key={section.title}
        className="rounded-[28px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]"
      >
        <div className="flex flex-col items-start justify-between gap-3">
          <div className="flex w-full items-center justify-between">
            <p className="text-sm font-bold text-slate-800">{section.title}</p>
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${section.status === "active" ? "bg-[#eef4ff] text-[#2454C8]" : "bg-slate-100 text-slate-500"}`}>
              {section.status === "active" ? "실데이터" : "점검"}
            </span>
          </div>
            <p className="text-xs leading-5 text-slate-400">{section.summary}</p>
        </div>

        <div className="mt-4 space-y-2">
          {section.metrics.map((metric) => (
            <div key={`${section.title}-${metric.label}`} className="rounded-2xl bg-[#f8fbff] px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold text-slate-400">{metric.label}</p>
                <p className="text-sm font-bold text-slate-800">{metric.value}</p>
              </div>
              {metric.detail ? <p className="mt-1 text-[11px] text-slate-500">{metric.detail}</p> : null}
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-1.5">
          {section.actions.slice(0, 2).map((action) => (
            <div key={action} className="flex items-center gap-2 rounded-xl bg-[#EDF3FF] px-3 py-2 text-xs font-medium text-[#2454C8]">
              <span className="material-symbols-outlined mt-0.5 shrink-0 text-[14px]">task_alt</span>
              {action}
            </div>
          ))}
        </div>
      </article>
    ))}
    {isLoading ? (
      <div className="rounded-[28px] border border-border bg-white px-5 py-5 text-sm text-slate-400 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        인사이트를 불러오는 중...
      </div>
    ) : null}
  </section>
);
