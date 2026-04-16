import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";

import { formatCount, formatCountWithUnit } from "@/commons/utils/format-count";
import type { ProductionAlertItem, ProductionOverviewAlertItem } from "@/features/production/types/production";
import {
  severityDetailClassMap,
  severityLabelMap,
  severitySummaryClassMap,
} from "@/features/production/data/production-alerts";
import type { AlertSeverity } from "@/features/production/types/production-alerts";
import { buildGroupedAlertSections } from "@/features/production/utils/production-alerts";

export function ProductionAlertsSection({
  alerts,
  items,
}: {
  alerts: ProductionAlertItem[];
  items: ProductionOverviewAlertItem[];
}) {
  const sections = useMemo(() => buildGroupedAlertSections(alerts, items), [alerts, items]);
  const [openSeverity, setOpenSeverity] = useState<AlertSeverity | null>(
    sections.some((section) => section.severity === "high") ? "high" : sections[0]?.severity ?? null,
  );

  if (sections.length === 0) {
    return (
      <section className="rounded-[24px] border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
        현재 긴급/주의 경고가 없습니다. 생산 운영 상태가 안정적입니다.
      </section>
    );
  }

  return (
    <section className="space-y-3">
      {sections.map((section) => {
        const opened = openSeverity === section.severity;
        return (
          <article
            key={section.severity}
            className={`overflow-hidden rounded-[24px] border shadow-[0_10px_24px_rgba(16,32,51,0.06)] ${severitySummaryClassMap[section.severity]}`}
          >
            <button
              type="button"
              onClick={() => setOpenSeverity((prev) => (prev === section.severity ? null : section.severity))}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
            >
              <div>
                <p className="text-base font-bold">{severityLabelMap[section.severity]} {formatCountWithUnit(section.count, "건")}</p>
                {section.representativeNames.length > 0 ? (
                  <p className="mt-1 text-sm">
                    {section.representativeNames.join(", ")}
                    {section.count > section.representativeNames.length ? ` 외 ${formatCount(section.count - section.representativeNames.length)}개` : ""}
                  </p>
                ) : null}
              </div>
              {opened ? <ChevronUp className="h-5 w-5 shrink-0" /> : <ChevronDown className="h-5 w-5 shrink-0" />}
            </button>

            {opened ? (
              <div className={`border-t px-5 py-4 ${severityDetailClassMap[section.severity]}`}>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] whitespace-nowrap text-sm">
                    <thead>
                      <tr className="border-b border-border/40 text-left">
                        <th className="px-2 py-2 text-xs font-bold text-slate-500">상품명</th>
                        <th className="px-2 py-2 text-xs font-bold text-slate-500">현재 재고</th>
                        <th className="px-2 py-2 text-xs font-bold text-slate-500">소진 예상</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.rows.slice(0, 4).map((row) => (
                        <tr key={row.key} className="border-b border-border/20 last:border-0">
                          <td className="px-2 py-3 font-semibold text-slate-800">{row.skuName}</td>
                          <td className="px-2 py-3 text-slate-700">{row.currentStock}</td>
                          <td className="px-2 py-3 text-slate-700">{row.depletionTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </article>
        );
      })}
    </section>
  );
}
