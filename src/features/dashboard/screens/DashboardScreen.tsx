import { useMemo, useState } from "react";

import { StatsGrid } from "@/components/common/page/page-layout";
import { DashboardHero } from "@/features/dashboard/components/DashboardHero";
import { InsightsSection } from "@/features/dashboard/components/InsightsSection";
import { PriorityActionsSection } from "@/features/dashboard/components/PriorityActionsSection";
import { SummaryCardsSection } from "@/features/dashboard/components/SummaryCardsSection";
import { useDashboardCardsQuery } from "@/features/dashboard/queries/useDashboardCardsQuery";
import { useDashboardInsightsQuery } from "@/features/dashboard/queries/useDashboardInsightsQuery";
import { useDashboardOverviewQuery } from "@/features/dashboard/queries/useDashboardOverviewQuery";
import { sessionUser } from "@/features/session/constants/session-user";
import type { DashboardDomain } from "@/features/dashboard/type/dashboard";

export function DashboardPage() {
  const [activeChat, setActiveChat] = useState<DashboardDomain | null>(null);
  const params = useMemo(
    () => ({
      store_id: sessionUser.storeId,
    }),
    [],
  );

  const overviewQuery = useDashboardOverviewQuery(params);
  const cardsQuery = useDashboardCardsQuery(params);
  const insightsQuery = useDashboardInsightsQuery(params);

  const stats = overviewQuery.data?.stats ?? [];
  const priorityActions = overviewQuery.data?.priority_actions ?? [];
  const summaryCards = cardsQuery.data?.cards ?? [];
  const insights = insightsQuery.data?.insights ?? [];

  return (
    <div className="space-y-6">
      <DashboardHero updatedAt={overviewQuery.data?.updated_at} />
      <PriorityActionsSection actions={priorityActions} />
      <StatsGrid stats={stats} />
      <SummaryCardsSection
        cards={summaryCards}
        activeChat={activeChat}
        onToggleChat={(domain) => setActiveChat((current) => (current === domain ? null : domain))}
      />
      <InsightsSection insights={insights} />
    </div>
  );
}
