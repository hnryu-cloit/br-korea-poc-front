import type { DashboardSummaryCard } from "@/features/dashboard/types/dashboard";
import {
  Clock,
  DollarSign,
  Target,
  getHighlightToneClasses,
} from "@/features/dashboard/components/dashboard-style";

export function SummaryCardBody({ card }: { card: DashboardSummaryCard }) {
  if (card.domain === "production") {
    return (
      <>
        {card.highlights.map((highlight) => (
          <div key={highlight.title} className={`rounded-2xl border px-4 py-3 ${getHighlightToneClasses(highlight.tone)}`}>
            <p className="text-sm font-bold">{highlight.title}</p>
            <p className="mt-1 text-sm opacity-90">{highlight.description}</p>
          </div>
        ))}
        <div className="space-y-3 rounded-2xl bg-[#f8fbff] px-4 py-4">
          {card.metrics.map((metric) => (
            <div key={metric.label} className="flex items-center justify-between text-sm">
              <span className="text-slate-500">{metric.label}</span>
              <span className={metric.tone === "danger" ? "font-bold text-red-600" : "font-bold text-slate-800"}>{metric.value}</span>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (card.domain === "ordering") {
    const [headline, subline] = card.highlights;
    return (
      <>
        {headline ? (
          <div className={`flex items-center justify-between rounded-2xl border px-4 py-4 ${getHighlightToneClasses(headline.tone)}`}>
            <div>
              <p className="font-bold text-orange-900">{headline.title}</p>
              <p className="mt-1 text-2xl font-bold text-orange-700">{headline.description.split(" · ")[0] ?? headline.description}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        ) : null}
        {subline ? (
          <div className={`rounded-2xl border px-4 py-3 ${getHighlightToneClasses(subline.tone)}`}>
            <p className="text-sm font-bold">{subline.title}</p>
            <p className="mt-1 text-sm text-slate-600">{subline.description}</p>
          </div>
        ) : null}
        <div className="space-y-2 rounded-2xl bg-[#f8fbff] px-4 py-4 text-sm">
          {card.metrics.map((metric) => (
            <div key={metric.label} className="flex items-center justify-between">
              <span className="text-slate-500">{metric.label}</span>
              <span className="font-bold text-slate-800">{metric.value}</span>
            </div>
          ))}
        </div>
      </>
    );
  }

  const [profitSummary, breakEvenSummary] = card.highlights;
  return (
    <>
      {profitSummary ? (
        <div className={`flex items-center justify-between rounded-2xl border px-4 py-4 ${getHighlightToneClasses(profitSummary.tone)}`}>
          <div>
            <p className="text-sm font-medium text-green-700">{profitSummary.title}</p>
            <p className="mt-1 text-2xl font-bold text-green-900">{profitSummary.description.split(" · ")[0] ?? profitSummary.description}</p>
            <p className="mt-1 text-xs text-green-700">{profitSummary.description.split(" · ")[1] ?? ""}</p>
          </div>
          <DollarSign className="h-8 w-8 text-green-500" />
        </div>
      ) : null}
      {breakEvenSummary ? (
        <div className={`rounded-2xl border px-4 py-3 ${getHighlightToneClasses(breakEvenSummary.tone)}`}>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-[#2454C8]" />
            <p className="text-sm font-bold">{breakEvenSummary.title}</p>
          </div>
          <p className="mt-1 text-sm text-slate-600">{breakEvenSummary.description}</p>
        </div>
      ) : null}
      <div className="space-y-2 rounded-2xl bg-[#f8fbff] px-4 py-4 text-sm">
        {card.metrics.map((metric) => (
          <div key={metric.label} className="flex items-center justify-between">
            <span className="text-slate-500">{metric.label}</span>
            <span className={metric.tone === "danger" ? "font-bold text-red-600" : "font-bold text-slate-800"}>{metric.value}</span>
          </div>
        ))}
      </div>
    </>
  );
}
