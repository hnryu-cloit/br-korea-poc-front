import { useMemo, useState } from "react";

import { StatsGrid } from "@/commons/components/page/page-layout";
import { OrderingConfirmSection } from "@/features/ordering/components/OrderingConfirmSection";
import { OrderingConfirmedSummary } from "@/features/ordering/components/OrderingConfirmedSummary";
import { OrderingContextCards } from "@/features/ordering/components/OrderingContextCards";
import { OrderingDeadlineAlert } from "@/features/ordering/components/OrderingDeadlineAlert";
import { OrderingHero } from "@/features/ordering/components/OrderingHero";
import { OrderingOptionsSection } from "@/features/ordering/components/OrderingOptionsSection";
import { OrderingPrincipleNotice } from "@/features/ordering/components/OrderingPrincipleNotice";
import { OrderingQuickChat } from "@/features/ordering/components/OrderingQuickChat";
import {
  orderingQuickPrompts,
  orderingStats,
} from "@/features/ordering/constants/ordering";
import { useOrderingCountdown } from "@/features/ordering/hooks/useOrderingCountdown";
import { useGetOrderingOptionsQuery } from "@/features/ordering/queries/useGetOrderingOptionsQuery";

export function OrderingPage() {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const optionsQuery = useGetOrderingOptionsQuery();
  const { seconds, mmss } = useOrderingCountdown(17 * 60, confirmed);
  const orderingOptions = optionsQuery.data?.options ?? [];
  const selectedOption = useMemo(
    () => orderingOptions.find((option) => option.option_id === selectedOptionId) ?? null,
    [orderingOptions, selectedOptionId],
  );

  if (confirmed && selectedOption) {
    return <OrderingConfirmedSummary option={selectedOption} reason={reason} />;
  }

  return (
    <div className="space-y-6">
      <OrderingHero timeText={mmss} showChat={showChat} onToggleChat={() => setShowChat((value) => !value)} />
      {showChat ? <OrderingQuickChat prompts={orderingQuickPrompts} /> : null}
      <StatsGrid stats={orderingStats} />
      <OrderingPrincipleNotice />
      <OrderingDeadlineAlert timeText={mmss} progressPct={Math.max((seconds / (20 * 60)) * 100, 3)} />
      <OrderingContextCards />
      <OrderingOptionsSection
        options={orderingOptions}
        selectedOptionId={selectedOptionId}
        onSelectOption={setSelectedOptionId}
      />
      {selectedOption ? (
        <OrderingConfirmSection
          reason={reason}
          onChangeReason={setReason}
          onConfirm={() => setConfirmed(true)}
        />
      ) : null}
    </div>
  );
}
