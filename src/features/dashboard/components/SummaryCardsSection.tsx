import { OrderingSummaryCardBody } from "@/features/dashboard/components/OrderingSummaryCardBody";
import { ProductionSummaryCardBody } from "@/features/dashboard/components/ProductionSummaryCardBody";
import { SalesSummaryCardBody } from "@/features/dashboard/components/SalesSummaryCardBody";
import { SummaryCard } from "@/features/dashboard/components/SummaryCard";
import { SUMMARY_CARD_ICON_MAP } from "@/features/dashboard/constants/summary-card";
import type { DashboardSummaryCard } from "@/features/dashboard/types/dashboard";

export function SummaryCardsSection({
  cards,
  updatedAt,
}: {
  cards: DashboardSummaryCard[];
  updatedAt?: string;
}) {
  return (
    <section className="grid gap-5 xl:grid-cols-3">
      {cards.map((card) => {
        const iconSrc = SUMMARY_CARD_ICON_MAP[card.domain];
        const body =
          card.domain === "production" ? (
            <ProductionSummaryCardBody items={card.top_products} updatedAt={updatedAt} />
          ) : card.domain === "ordering" ? (
            <OrderingSummaryCardBody card={card} />
          ) : (
            <SalesSummaryCardBody card={card} />
          );

        const captionKey =
          card.domain === "production"
            ? "dashboard:production_summary"
            : card.domain === "ordering"
              ? "dashboard:ordering_summary"
              : "dashboard:sales_summary";

        return (
          <SummaryCard
            key={card.domain}
            icon={<img src={iconSrc} alt="" className="h-5 w-5" />}
            title={card.title}
            captionKey={captionKey}
            pathname={card.cta_path}
            domain={card.domain}
            recommendedQuestions={card.recommended_questions.slice(0, 3)}
          >
            {body}
          </SummaryCard>
        );
      })}
    </section>
  );
}
