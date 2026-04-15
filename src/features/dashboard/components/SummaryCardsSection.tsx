import type { DashboardSummaryCard } from "@/features/dashboard/types/dashboard";
import { summaryCardIconMap } from "@/features/dashboard/components/dashboard-style";
import { SummaryCard } from "@/features/dashboard/components/SummaryCard";
import { SummaryCardBody } from "@/features/dashboard/components/SummaryCardBody";

export function SummaryCardsSection({
  cards,
}: {
  cards: DashboardSummaryCard[];
}) {
  return (
    <section className="grid gap-5 xl:grid-cols-3">
      {cards.map((card) => (
        <SummaryCard
          key={card.domain}
          domain={card.domain}
          icon={summaryCardIconMap[card.domain]}
          title={card.title}
          description={card.description}
          statusLabel={card.status_label}
          deadlineMinutes={card.deadline_minutes}
          deliveryScheduled={card.delivery_scheduled}
          to={card.cta_path}
          cta={card.cta_label}
        >
          <SummaryCardBody card={card} />
        </SummaryCard>
      ))}
    </section>
  );
}
