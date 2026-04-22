import { OrderingSummaryCardBody } from "@/features/dashboard/components/OrderingSummaryCardBody";
import { ProductionSummaryCardBody } from "@/features/dashboard/components/ProductionSummaryCardBody";
import { SalesSummaryCardBody } from "@/features/dashboard/components/SalesSummaryCardBody";
import { SummaryCard } from "@/features/dashboard/components/SummaryCard";
import { SUMMARY_CARD_ICON_MAP } from "@/features/dashboard/constants/summary-card";
import type { DashboardSummaryCard } from "@/features/dashboard/types/dashboard";

const summaryCardBodyMap = {
  production: <ProductionSummaryCardBody />,
  ordering: <OrderingSummaryCardBody />,
  sales: <SalesSummaryCardBody />,
} as const;

export function SummaryCardsSection({ cards }: { cards: DashboardSummaryCard[] }) {
  return (
    <section className="grid gap-5 xl:grid-cols-3">
      {cards.map((card) => {
        const iconSrc = SUMMARY_CARD_ICON_MAP[card.domain];

        return (
          <SummaryCard
            key={card.domain}
            icon={<img src={iconSrc} alt="" className="h-5 w-5" />}
            title={card.title}
            pathname={card.cta.path}
            recommendedQuestions={card.prompts.slice(0, 3)}
          >
            {summaryCardBodyMap[card.domain]}
          </SummaryCard>
        );
      })}
    </section>
  );
}
