import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { CardAiButton } from "@/commons/components/chat/CardAiButton";
import { PageTitle } from "@/commons/components/page/PageTitle";
import { OrderingConfirmSection } from "@/features/ordering/components/OrderingConfirmSection";
import { OrderingConfirmedSummary } from "@/features/ordering/components/OrderingConfirmedSummary";
import { OrderingContextCards } from "@/features/ordering/components/OrderingContextCards";
import { OrderingDeadlineAlert } from "@/features/ordering/components/OrderingDeadlineAlert";
import { OrderingOptionsSection } from "@/features/ordering/components/OrderingOptionsSection";
import { MOCK_ORDERING_DEADLINE_ITEMS } from "@/features/ordering/data/mock-ordering-deadline-items";
import { useOrderingCountdown } from "@/features/ordering/hooks/useOrderingCountdown";
import { useGetOrderingContextQuery } from "@/features/ordering/queries/useGetOrderingContextQuery";
import { useGetOrderingOptionsQuery } from "@/features/ordering/queries/useGetOrderingOptionsQuery";
import { usePostOrderingSelectionMutation } from "@/features/ordering/queries/usePostOrderingSelectionMutation";

const USE_ORDERING_DEADLINE_MOCK = true;

export function OrderingRecommendationsScreen() {
  const location = useLocation();
  const routeState = location.state as {
    source?: string;
    notificationId?: number;
    focusOptionId?: string;
    domain?: string;
    intent?: "view" | "ask";
    prompt?: string;
    chatHistoryId?: string;
  } | null;
  const notificationEntry = routeState?.source === "notification";
  const notificationId = notificationEntry ? (routeState?.notificationId ?? null) : null;
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const optionsQuery = useGetOrderingOptionsQuery({ notification_entry: notificationEntry });

  const contextQuery = useGetOrderingContextQuery(notificationId);
  const postOrderingSelectionMutation = usePostOrderingSelectionMutation();

  useOrderingCountdown((optionsQuery.data?.deadline_minutes ?? 20) * 60, confirmed);

  const orderingOptions = useMemo(
    () => optionsQuery.data?.options ?? [],
    [optionsQuery.data?.options],
  );

  const defaultOptionId = useMemo(() => {
    const focusOptionId = routeState?.focusOptionId ?? contextQuery.data?.focus_option_id ?? null;
    const fallbackOptionId =
      orderingOptions.find((option) => option.recommended)?.option_id ??
      orderingOptions[0]?.option_id ??
      null;
    return focusOptionId ?? fallbackOptionId;
  }, [contextQuery.data?.focus_option_id, orderingOptions, routeState?.focusOptionId]);

  const effectiveSelectedOptionId = selectedOptionId ?? defaultOptionId;
  const selectedOption = useMemo(
    () => orderingOptions.find((option) => option.option_id === effectiveSelectedOptionId) ?? null,
    [effectiveSelectedOptionId, orderingOptions],
  );
  const deadlineItems = useMemo(
    () => (USE_ORDERING_DEADLINE_MOCK ? MOCK_ORDERING_DEADLINE_ITEMS : []),
    [],
  );
  const handleConfirm = async () => {
    if (!effectiveSelectedOptionId || postOrderingSelectionMutation.isPending) return;
    setSubmitError(null);
    try {
      const response = await postOrderingSelectionMutation.mutateAsync({
        option_id: effectiveSelectedOptionId,
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
    return (
      <div className="space-y-6">
        <OrderingConfirmedSummary option={selectedOption} />
        {/* <InPageCarousel items={orderingPostBanners} /> */}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle
        title="주문 관리"
        description="주문 누락 방지를 목적으로 추천 3안을 비교합니다. 예측과 권고는 최소 범위로 제공하며 최종 의사결정은 점주가 수행합니다."
      >
        <CardAiButton contextKey="ordering:options" />
      </PageTitle>
      <OrderingDeadlineAlert
        deadlineAt={optionsQuery.data?.deadline_at}
        deadlineItems={deadlineItems}
      />
      <OrderingContextCards
        weather={optionsQuery.data?.weather}
        trend={optionsQuery.data?.trend_summary}
      />
      <OrderingOptionsSection
        options={orderingOptions}
        selectedOptionId={effectiveSelectedOptionId}
        onSelectOption={setSelectedOptionId}
      />
      {selectedOption ? (
        <OrderingConfirmSection
          onConfirm={handleConfirm}
          isSubmitting={postOrderingSelectionMutation.isPending}
          errorMessage={submitError}
        />
      ) : null}
    </div>
  );
}
