import { CardAiButton } from "@/commons/components/chat/CardAiButton";
import { PageTitle } from "@/commons/components/page/PageTitle";
import { ProductionWasteSection } from "@/features/production/components/ProductionWasteSection";
import { useGetProductionWasteQuery } from "@/features/production/queries/useGetProductionWasteQuery";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";

export function ProductionWasteLossScreen() {
  const { user } = useDemoSession();

  const wasteQuery = useGetProductionWasteQuery(user.storeId ?? "");

  return (
    <div className="space-y-6">
      <PageTitle title="폐기 손실 현황" description="품목별 폐기 수량과 손실 금액을 확인합니다.">
        <CardAiButton contextKey="production:waste" />
      </PageTitle>
      <ProductionWasteSection data={wasteQuery.data} isLoading={wasteQuery.isLoading} />
    </div>
  );
}
