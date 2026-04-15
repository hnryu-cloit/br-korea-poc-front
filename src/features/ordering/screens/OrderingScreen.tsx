import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { StatsGrid } from "@/commons/components/page/page-layout";
import { getDashboardCardChatHistory } from "@/commons/utils/dashboard-card-chat-history";
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
} from "@/features/ordering/constants/ordering";
import { useOrderingCountdown } from "@/features/ordering/hooks/useOrderingCountdown";
import { useGetOrderingContextQuery } from "@/features/ordering/queries/useGetOrderingContextQuery";
import { useGetOrderingOptionsQuery } from "@/features/ordering/queries/useGetOrderingOptionsQuery";
import { usePostOrderingSelectionMutation } from "@/features/ordering/queries/usePostOrderingSelectionMutation";
import type { HighlightStat } from "@/commons/constants/page-content";

export function OrderingPage() {
  const location = useLocation();
  const routeState = location.state as {
    source?: string;
    notificationId?: number;
    focusOptionId?: string;
    domain?: string;
    intent?: "view" | "ask";
    prompt?: string;
  } | null;
  const fromDashboardOrdering = routeState?.source === "dashboard-card-chat" && routeState?.domain === "ordering";
  const notificationEntry = routeState?.source === "notification";
  const notificationId = notificationEntry ? (routeState?.notificationId ?? null) : null;
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [showChat, setShowChat] = useState(fromDashboardOrdering);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const optionsQuery = useGetOrderingOptionsQuery({ notification_entry: notificationEntry });
  const contextQuery = useGetOrderingContextQuery(notificationId);
  const postOrderingSelectionMutation = usePostOrderingSelectionMutation();
  const { mmss } = useOrderingCountdown((optionsQuery.data?.deadline_minutes ?? 17) * 60, confirmed);
  const orderingOptions = useMemo(
    () => optionsQuery.data?.options ?? [],
    [optionsQuery.data?.options],
  );
  const defaultOptionId = useMemo(() => {
    const focusOptionId = routeState?.focusOptionId ?? contextQuery.data?.focus_option_id ?? null;
    const fallbackOptionId = orderingOptions.find((option) => option.recommended)?.option_id ?? orderingOptions[0]?.option_id ?? null;
    return focusOptionId ?? fallbackOptionId;
  }, [contextQuery.data?.focus_option_id, orderingOptions, routeState?.focusOptionId]);
  const effectiveSelectedOptionId = selectedOptionId ?? defaultOptionId;
  const selectedOption = useMemo(
    () => orderingOptions.find((option) => option.option_id === effectiveSelectedOptionId) ?? null,
    [effectiveSelectedOptionId, orderingOptions],
  );
  const dashboardChatHistory = fromDashboardOrdering ? getDashboardCardChatHistory("ordering") : [];

  const handleConfirm = async () => {
    if (!effectiveSelectedOptionId || postOrderingSelectionMutation.isPending) return;
    setSubmitError(null);
    try {
      const response = await postOrderingSelectionMutation.mutateAsync({
        option_id: effectiveSelectedOptionId,
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

  const orderingStats: HighlightStat[] = [  
    {
      label: "주문 마감까지",
      value: typeof optionsQuery.data?.deadline_minutes === "number"
        ? `${optionsQuery.data.deadline_minutes}분`
        : "-",
      tone: "danger" as const,
    },
    { label: "추천 옵션", value: `${orderingOptions.length}개`, tone: "primary" as const },
    {
      label: "기준 영업일",
      value: optionsQuery.data?.business_date ?? "-",
      tone: "default" as const,
    },
    {
      label: "주문 기준",
      value: optionsQuery.data?.deadline_at ?? "-",
      tone: "success" as const,
    }
  ];

  return (
    <div className="space-y-6">
      <OrderingHero timeText={mmss} showChat={showChat} onToggleChat={() => setShowChat((value) => !value)} />
      {showChat ? (
        <OrderingQuickChat
          prompts={orderingQuickPrompts}
          initialHistory={dashboardChatHistory}
          initialInput={
            fromDashboardOrdering && dashboardChatHistory.length === 0 && routeState?.intent === "ask"
              ? routeState.prompt ?? ""
              : ""
          }
        />
      ) : null}
      <StatsGrid stats={orderingStats} />
      <OrderingPrincipleNotice purpose={optionsQuery.data?.purpose_text} caution={optionsQuery.data?.caution_text} />
      <OrderingDeadlineAlert deadlineAt={optionsQuery.data?.deadline_at} />
      <OrderingContextCards weather={optionsQuery.data?.weather_summary} trend={optionsQuery.data?.trend_summary} />
      <OrderingOptionsSection
        options={orderingOptions}
        selectedOptionId={effectiveSelectedOptionId}
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
