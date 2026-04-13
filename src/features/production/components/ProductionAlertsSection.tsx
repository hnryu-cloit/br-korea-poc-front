import { Wrench, Zap } from "lucide-react";

import type { ProductionAlertItem, ProductionSkuItem } from "@/features/production/type/production";

function findPrimarySku(items: ProductionSkuItem[], alert: ProductionAlertItem) {
  if (!alert.sku_id) return null;
  return items.find((item) => item.sku_id === alert.sku_id) ?? null;
}

export function ProductionAlertsSection({
  alerts,
  items,
  onOpenRegister,
}: {
  alerts: ProductionAlertItem[];
  items: ProductionSkuItem[];
  onOpenRegister: (sku: ProductionSkuItem) => void;
}) {
  return (
    <section className="space-y-3">
      {alerts.map((alert) => {
        const relatedSku = findPrimarySku(items, alert);
        if (alert.type === "inventory_risk") {
          return (
            <article key={alert.id} className="rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-bold text-red-700">{alert.title}</p>
                  <p className="mt-1 text-sm text-red-600">{alert.description}</p>
                </div>
                {relatedSku ? (
                  <button
                    type="button"
                    onClick={() => onOpenRegister(relatedSku)}
                    className="rounded-2xl bg-[#2454C8] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#1d44a8]"
                  >
                    생산하기
                  </button>
                ) : null}
              </div>
            </article>
          );
        }

        if (alert.type === "speed_risk") {
          return (
            <article key={alert.id} className="rounded-[24px] border border-orange-200 bg-orange-50 px-5 py-4 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
              <div className="flex items-start gap-3">
                <Zap className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                <div>
                  <p className="text-base font-bold text-orange-700">{alert.title}</p>
                  <p className="mt-1 text-sm text-orange-600">{alert.description}</p>
                </div>
              </div>
            </article>
          );
        }

        return (
          <article key={alert.id} className="rounded-[24px] border border-yellow-200 bg-yellow-50 px-5 py-4 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
            <div className="flex items-start gap-3">
              <Wrench className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
              <div>
                <p className="text-base font-bold text-yellow-700">{alert.title}</p>
                <p className="mt-1 text-sm text-yellow-700">{alert.description}</p>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
