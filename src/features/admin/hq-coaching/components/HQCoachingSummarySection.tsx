import { formatCountWithUnit } from "@/commons/utils/format-count";

type Props = {
  normalCount: number;
  reviewCount: number;
  riskCount: number;
};

export function HQCoachingSummarySection({ normalCount, reviewCount, riskCount }: Props) {
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {[
        { label: "정상 완료", value: formatCountWithUnit(normalCount, "개"), className: "bg-green-50 text-green-600 border border-green-100" },
        { label: "검토 필요", value: formatCountWithUnit(reviewCount, "개"), className: "bg-orange-50 text-orange-600 border border-orange-100" },
        { label: "미완료", value: formatCountWithUnit(riskCount, "개"), className: "bg-red-50 text-red-600 border border-red-100" },
      ].map((item) => (
        <article key={item.label} className="rounded-[26px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
          <div className={`mt-4 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${item.className}`}>{item.value}</div>
        </article>
      ))}
    </section>
  );
}
