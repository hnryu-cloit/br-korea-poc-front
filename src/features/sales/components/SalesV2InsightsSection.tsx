import type { SalesInsightSection } from "@/features/sales/types/sales";
import ai_pencil from "@/assets/ai-pencil.svg";

export const SalesV2InsightsSection = ({
  sections,
  isLoading,
}: {
  sections: SalesInsightSection[];
  isLoading: boolean;
}) => (
  <section className="grid gap-4 lg:grid-cols-3">
    {sections.map((section) => (
      <article
        key={section.title}
        className="rounded-[28px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)] flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <p className="text-md font-bold text-brown-700">{section.title}</p>
          <p className="text-sm leading-5 text-[#653819]">{section.summary}</p>
        </div>

        <div className="flex flex-col gap-1">
          {section.metrics.map((metric) => (
            <div
              key={`${section.title}-${metric.label}`}
              className="rounded-[8px] bg-[#DADADA66] px-3 py-2 flex flex-col gap-1"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#653819]">{metric.label}</p>
                <p className="text-sm font-bold text-orange-500">{metric.value}</p>
              </div>
              {metric.detail ? <p className="text-xs text-[#653819]">{metric.detail}</p> : null}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {section.actions.slice(0, 2).map((action) => (
            <div
              key={action}
              className="flex items-center gap-2 border border-[#FFB38F] rounded-xl bg-[#FFD9C71A] px-3 py-2 text-sm font-medium text-[#41352E]"
            >
              <img src={ai_pencil} className="w-4 h-4" />
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
