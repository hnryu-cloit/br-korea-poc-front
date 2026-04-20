import { ProductionHero } from "@/features/production/components/ProductionHero";
import { ProductionWasteSection } from "@/features/production/components/ProductionWasteSection";
import { useGetProductionWasteQuery } from "@/features/production/queries/useGetProductionWasteQuery";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";

export function ProductionWasteLossScreen() {
  const { user } = useDemoSession();

  const wasteQuery = useGetProductionWasteQuery(user.storeId ?? "");

  return (
    <div className="space-y-6">
      <ProductionHero title="폐기 손실 현황" description="" />
      <ProductionWasteSection data={wasteQuery.data} isLoading={wasteQuery.isLoading} />
    </div>
  );
}
