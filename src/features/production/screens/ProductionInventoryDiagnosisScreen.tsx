
import { ProductionHero } from "@/features/production/components/ProductionHero";
import { ProductionInventoryStatusSection } from "@/features/production/components/ProductionInventoryStatusSection";
import { useGetProductionInventoryStatusQuery } from "@/features/production/queries/useGetProductionInventoryStatusQuery";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";

export function ProductionInventoryDiagnosisScreen() {
  const { user } = useDemoSession();

  const inventoryStatusQuery = useGetProductionInventoryStatusQuery(user.storeId ?? "");

  return (
    <div className="space-y-6">
      <ProductionHero
        title="재고 수준 진단"
        description=""
      />
      <ProductionInventoryStatusSection data={inventoryStatusQuery.data} isLoading={inventoryStatusQuery.isLoading} />
    </div>
  );
}
