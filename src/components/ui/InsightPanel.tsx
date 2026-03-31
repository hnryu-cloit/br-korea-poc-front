import type { InsightCard } from "@/data/page-content";

export function InsightPanel({ title, description, items }: InsightCard) {
  return (
    <article className="rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <p className="text-lg font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item} className="rounded-2xl bg-[#f8fbff] px-4 py-3 text-sm leading-6 text-slate-600">
            {item}
          </div>
        ))}
      </div>
    </article>
  );
}
