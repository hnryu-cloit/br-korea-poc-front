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
import { usePostOrderingSelectionMutation } from "@/features/ordering/queries/usePostOrderingSelectionMutation";

export function OrderingPage() {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const optionsQuery = useGetOrderingOptionsQuery();
  const postOrderingSelectionMutation = usePostOrderingSelectionMutation();
  const { seconds, mmss } = useOrderingCountdown(17 * 60, confirmed);
  const orderingOptions = optionsQuery.data?.options ?? [];
  const selectedOption = useMemo(
    () => orderingOptions.find((option) => option.option_id === selectedOptionId) ?? null,
    [orderingOptions, selectedOptionId],
  );

  const handleConfirm = async () => {
    if (!selectedOptionId || postOrderingSelectionMutation.isPending) return;
    setSubmitError(null);
    try {
      const response = await postOrderingSelectionMutation.mutateAsync({
        option_id: selectedOptionId,
        reason: reason.trim() || undefined,
      });
      if (response.saved) {
        setConfirmed(true);
        return;
      }
      setSubmitError("주문 확정 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } catch {
      setSubmitError("주문 확정 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

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
          onConfirm={handleConfirm}
          isSubmitting={postOrderingSelectionMutation.isPending}
          errorMessage={submitError}
        />
      ) : null}
    </div>
  );
}
