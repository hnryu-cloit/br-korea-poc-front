import type { DashboardDomain, DashboardSummaryCard } from "@/features/dashboard/type/dashboard";
import { summaryCardIconMap } from "@/features/dashboard/components/dashboard-style";
import { SummaryCard } from "@/features/dashboard/components/SummaryCard";
import { SummaryCardBody } from "@/features/dashboard/components/SummaryCardBody";

export function SummaryCardsSection({
  cards,
  activeChat,
  onToggleChat,
}: {
  cards: DashboardSummaryCard[];
  activeChat: DashboardDomain | null;
  onToggleChat: (domain: DashboardDomain) => void;
}) {
  return (
    <section className="grid gap-5 xl:grid-cols-3">
      {cards.map((card) => (
        <SummaryCard
          key={card.domain}
          icon={summaryCardIconMap[card.domain]}
          title={card.title}
          description={card.description}
          chatItems={card.prompts.map((prompt) => prompt.label)}
          activeChat={activeChat === card.domain}
          onToggleChat={() => onToggleChat(card.domain)}
          to={card.cta_path}
          cta={card.cta_label}
        >
          <SummaryCardBody card={card} />
        </SummaryCard>
      ))}
    </section>
  );
}
