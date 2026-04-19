import { formatCount, formatCountWithUnit } from "@/commons/utils/format-count";

type Props = {
  compliantCount: number;
  inspectionsCount: number;
  avgResponseRate: number;
  noncompliantCount: number;
};

export function HQInspectionSummarySection({
  compliantCount,
  inspectionsCount,
  avgResponseRate,
  noncompliantCount,
}: Props) {
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {[
        { label: "생산 준수 매장", value: `${formatCount(compliantCount)} / ${formatCount(inspectionsCount)}`, tone: "success" },
        { label: "평균 알림 대응률", value: `${avgResponseRate}%`, tone: "primary" },
        { label: "미준수 매장", value: formatCountWithUnit(noncompliantCount, "개"), tone: "danger" },
      ].map((item) => (
        <article key={item.label} className="rounded-[26px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
          <div className={`mt-4 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
            item.tone === "success" ? "bg-green-50 text-green-600" : item.tone === "primary" ? "bg-[#eef4ff] text-[#2454c8]" : "bg-red-50 text-red-600"
          }`}>{item.value}</div>
        </article>
      ))}
    </section>
  );
}
