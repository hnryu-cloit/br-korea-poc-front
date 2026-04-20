import { CardAiButton } from "@/commons/components/chat/CardAiButton";
import { PageTitle } from "@/commons/components/page/PageTitle";
import { ProductionInventoryStatusSection } from "@/features/production/components/ProductionInventoryStatusSection";
import { useGetProductionInventoryStatusQuery } from "@/features/production/queries/useGetProductionInventoryStatusQuery";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";

export function ProductionInventoryDiagnosisScreen() {
  const { user } = useDemoSession();

  const inventoryStatusQuery = useGetProductionInventoryStatusQuery(user.storeId ?? "");

  return (
    <div className="space-y-6">
      <PageTitle
        title="재고 수준 진단"
        description="품목별 현재 재고와 판매량 비교를 통해 적정 재고 수준을 진단합니다."
      >
        <CardAiButton contextKey="production:inventory-status" />
      </PageTitle>
      <ProductionInventoryStatusSection
        data={inventoryStatusQuery.data}
        isLoading={inventoryStatusQuery.isLoading}
      />
    </div>
  );
}
