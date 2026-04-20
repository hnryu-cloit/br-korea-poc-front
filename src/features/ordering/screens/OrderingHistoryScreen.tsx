import { CardAiButton } from "@/commons/components/chat/CardAiButton";
import { StatsGrid } from "@/commons/components/page/page-layout";
import { PageTitle } from "@/commons/components/page/PageTitle";
import type { HighlightStat } from "@/commons/constants/page-content";
import { formatCountWithUnit } from "@/commons/utils/format-count";
import { OrderingHistorySection } from "@/features/ordering/components/OrderingHistorySection";
import { useGetOrderingHistoryQuery } from "@/features/ordering/queries/useGetOrderingHistoryQuery";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";

export function OrderingHistoryScreen() {
  const { user } = useDemoSession();

  const historyQuery = useGetOrderingHistoryQuery(user.storeId);

  const orderingHistoryStats: HighlightStat[] = [
    {
      label: "총 발주 건수",
      value: historyQuery.data ? formatCountWithUnit(historyQuery.data.total_count, "건") : "-",
      tone: "primary" as const,
    },
    {
      label: "자동 발주 비중",
      value: historyQuery.data ? `${Math.round(historyQuery.data.auto_rate * 100)}%` : "-",
      tone: "success" as const,
    },
    {
      label: "수동 발주 비중",
      value: historyQuery.data ? `${Math.round(historyQuery.data.manual_rate * 100)}%` : "-",
      tone: "default" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <PageTitle
        title="발주 이력"
        description="일자·품목별 발주 이력과 자동/수동 비중을 함께 점검해 주문 누락과 과다 발주 패턴을 관리합니다."
      >
        <CardAiButton contextKey="ordering:history" />
      </PageTitle>
      <StatsGrid stats={orderingHistoryStats} />
      <OrderingHistorySection data={historyQuery.data} isLoading={historyQuery.isLoading} />
    </div>
  );
}
