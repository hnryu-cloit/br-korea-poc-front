import { useMemo, useState } from "react";

import { StatsGrid } from "@/commons/components/page/page-layout";
import { DashboardHero } from "@/features/dashboard/components/DashboardHero";
import { InsightsSection } from "@/features/dashboard/components/InsightsSection";
import { PriorityActionsSection } from "@/features/dashboard/components/PriorityActionsSection";
import { SummaryCardsSection } from "@/features/dashboard/components/SummaryCardsSection";
import { useDashboardOverviewQuery } from "@/features/dashboard/queries/useDashboardOverviewQuery";
import { sessionUser } from "@/features/session/constants/session-user";
import type { DashboardDomain } from "@/features/dashboard/types/dashboard";
import dayjs from "dayjs";
import { INSIGHTS } from "../mockdata/insights";

export function DashboardPage() {
  const [activeChat, setActiveChat] = useState<DashboardDomain | null>(null);
  const now = dayjs(new Date()).format("YYYY-MM-DD");
  const params = useMemo(
    () => ({
      store_id: sessionUser.storeId,
      business_date:now
    }),
    [],
  );
  const overviewQuery = useDashboardOverviewQuery(params);

  const priorityActions = overviewQuery.data?.priority_actions ?? [];
  const stats = overviewQuery.data?.stats ?? [];
  const cards = overviewQuery.data?.cards ?? [];

  return (
    <div className="space-y-6">
      <DashboardHero updatedAt={overviewQuery.data?.updated_at} />
      <PriorityActionsSection actions={priorityActions} />
      <StatsGrid stats={stats} />
      <SummaryCardsSection
        cards={cards}
        activeChat={activeChat}
        onToggleChat={(domain) => setActiveChat((current) => (current === domain ? null : domain))}
      />
      <InsightsSection insights={INSIGHTS} />
    </div>
  );
}
