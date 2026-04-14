import type { DashboardSummaryCard } from "@/features/dashboard/types/dashboard";

export function SummaryCardBody({ card }: { card: DashboardSummaryCard }) {
    return (
      <>
        {card.highlights.map((highlight) => (
          <div key={highlight} className={`rounded-2xl border px-4 py-3`}>
            <p className="text-sm font-bold">{highlight}</p>
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
