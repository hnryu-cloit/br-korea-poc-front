import { salesTabs } from "@/features/sales/constants/sales-tabs";
import type { SalesTabKey } from "@/features/sales/types/sales-screen";

export function SalesTabs({
  tab,
  onChangeTab,
}: {
  tab: SalesTabKey;
  onChangeTab: (tab: SalesTabKey) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 p-3">
      {salesTabs.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onChangeTab(item.key)}
          className={`rounded-2xl px-4 py-2 text-sm font-bold transition-colors ${
            tab === item.key
              ? "bg-[#2454C8] text-white"
              : "bg-[#f7faff] text-slate-600 hover:bg-[#eef4ff] hover:text-[#2454C8]"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
