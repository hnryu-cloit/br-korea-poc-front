import { useQuery } from "@tanstack/react-query";

import { PageHero } from "@/commons/components/page/page-layout";
import { getHQInspection } from "@/features/admin/hq-inspection/api/hq-inspection";
import { HQInspectionSummarySection } from "@/features/admin/hq-inspection/components/HQInspectionSummarySection";
import { HQInspectionTableSection } from "@/features/admin/hq-inspection/components/HQInspectionTableSection";

export function HQInspectionPage() {
  const inspectionQuery = useQuery({
    queryKey: ["hq-inspection"],
    queryFn: getHQInspection,
    refetchInterval: 30_000,
  });

  const inspections = inspectionQuery.data?.items ?? [];
  const compliantCount = inspections.filter((i) => i.status === "compliant").length;
  const noncompliantCount = inspections.filter((i) => i.status === "noncompliant").length;
  const avgResponseRate =
    inspections.length > 0
      ? Math.round(inspections.reduce((s, i) => s + i.alert_response_rate, 0) / inspections.length)
      : 0;

  return (
    <div className="space-y-6">
      <PageHero
        title="매장별 생산 준수 현황을 점검합니다."
        description="알림 대응률과 등록 완료율이 낮은 매장을 빠르게 파악합니다."
      />
      <HQInspectionSummarySection
        compliantCount={compliantCount}
        inspectionsCount={inspections.length}
        avgResponseRate={avgResponseRate}
        noncompliantCount={noncompliantCount}
      />
      <HQInspectionTableSection inspections={inspections} isLoading={inspectionQuery.isLoading} />
    </div>
  );
}
