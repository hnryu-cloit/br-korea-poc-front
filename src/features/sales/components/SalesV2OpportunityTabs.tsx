import { SALES_OPPORTUNITY_TABS } from "@/features/sales/constants/sales-opportunity-tabs";
import type { SalesOpportunityTabKey } from "@/features/sales/types/sales-opportunity";

export const SalesV2OpportunityTabs = ({
  activeTab,
  onChangeTab,
}: {
  activeTab: SalesOpportunityTabKey;
  onChangeTab: (tab: SalesOpportunityTabKey) => void;
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {SALES_OPPORTUNITY_TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChangeTab(tab.key)}
          className={`rounded-2xl px-4 py-2 text-sm font-bold transition-colors ${
            activeTab === tab.key
              ? "bg-[#2454C8] text-white"
              : "bg-[#f7faff] text-slate-600 hover:bg-[#eef4ff] hover:text-[#2454C8]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
