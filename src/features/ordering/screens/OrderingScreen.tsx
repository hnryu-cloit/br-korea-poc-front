import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { InPageCarousel } from "@/commons/components/carousel/InPageCarousel";
import { StatsGrid } from "@/commons/components/page/page-layout";
import { formatCountWithUnit } from "@/commons/utils/format-count";
import { getDashboardCardChatHistory } from "@/commons/utils/dashboard-card-chat-history";
import { OrderingConfirmSection } from "@/features/ordering/components/OrderingConfirmSection";
import { OrderingConfirmedSummary } from "@/features/ordering/components/OrderingConfirmedSummary";
import { OrderingContextCards } from "@/features/ordering/components/OrderingContextCards";
import { OrderingDeadlineAlert } from "@/features/ordering/components/OrderingDeadlineAlert";
import { OrderingHero } from "@/features/ordering/components/OrderingHero";
import { OrderingHistorySection } from "@/features/ordering/components/OrderingHistorySection";
import { OrderingOptionsSection } from "@/features/ordering/components/OrderingOptionsSection";
import { OrderingPrincipleNotice } from "@/features/ordering/components/OrderingPrincipleNotice";
import { OrderingQuickChat } from "@/features/ordering/components/OrderingQuickChat";
import { useOrderingCountdown } from "@/features/ordering/hooks/useOrderingCountdown";
import { useGetOrderingContextQuery } from "@/features/ordering/queries/useGetOrderingContextQuery";
import { useGetOrderingHistoryQuery } from "@/features/ordering/queries/useGetOrderingHistoryQuery";
import { useGetOrderingOptionsQuery } from "@/features/ordering/queries/useGetOrderingOptionsQuery";
import { usePostOrderingSelectionMutation } from "@/features/ordering/queries/usePostOrderingSelectionMutation";
import { orderingPostBanners } from "@/features/ordering/constants/ordering-banners";
import { useGetSalesPromptsQuery } from "@/features/sales/queries/useGetSalesPromptsQuery";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";
import type { HighlightStat } from "@/commons/constants/page-content";

export function OrderingPage() {
  const { user } = useDemoSession();
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
  const fromDashboardOrdering = routeState?.source === "dashboard-card-chat" && routeState?.domain === "ordering";
  const notificationEntry = routeState?.source === "notification";
  const notificationId = notificationEntry ? (routeState?.notificationId ?? null) : null;
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [showChat, setShowChat] = useState(fromDashboardOrdering);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const optionsQuery = useGetOrderingOptionsQuery({ notification_entry: notificationEntry });
  const orderingPromptsQuery = useGetSalesPromptsQuery({ store_id: user.storeId, domain: "ordering" });
  const contextQuery = useGetOrderingContextQuery(notificationId);
  const historyQuery = useGetOrderingHistoryQuery(user.storeId);
  const postOrderingSelectionMutation = usePostOrderingSelectionMutation();
  useOrderingCountdown((optionsQuery.data?.deadline_minutes ?? 20) * 60, confirmed);
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
  const orderingQuickPrompts = useMemo(() => {
    const recommended = orderingOptions.find((option) => option.recommended);
    const recommendedLabel = recommended?.title ?? "추천안";
    const deadline = optionsQuery.data?.deadline_minutes ?? 20;
    return [
      `${user.storeName} 기준 ${recommendedLabel} 추천 근거는?`,
      `오늘 주문 마감 ${deadline}분 전 우선 확인 항목은?`,
      `${user.storeName}의 어제 대비 주문 변화 원인은?`,
      `지금 선택한 주문안의 품절 리스크는?`,
    ];
  }, [optionsQuery.data?.deadline_minutes, orderingOptions, user.storeName]);
  const quickPromptCandidates = useMemo(() => {
    const aiPrompts = (orderingPromptsQuery.data ?? []).map((item) => item.prompt).filter(Boolean);
    if (aiPrompts.length > 0) {
      return aiPrompts.slice(0, 4);
    }
    return orderingQuickPrompts.slice(0, 4);
  }, [orderingPromptsQuery.data, orderingQuickPrompts]);
  const dashboardChatHistory = fromDashboardOrdering && routeState?.chatHistoryId
    ? getDashboardCardChatHistory("ordering").filter((item) => item.id === routeState.chatHistoryId)
    : [];

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
    return (
      <div className="space-y-6">
        <OrderingConfirmedSummary option={selectedOption} reason={reason} />
        <InPageCarousel items={orderingPostBanners} />
      </div>
    );
  }

  const orderingStats: HighlightStat[] = [  
    {
      label: "주문 마감까지",
      value: typeof optionsQuery.data?.deadline_minutes === "number"
        ? `${optionsQuery.data.deadline_minutes}분`
        : "-",
      tone: "danger" as const,
    },
    { label: "추천 옵션", value: formatCountWithUnit(orderingOptions.length, "개"), tone: "primary" as const },
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
      <OrderingHero showChat={showChat} onToggleChat={() => setShowChat((value) => !value)} />
      {showChat ? (
        <OrderingQuickChat
          prompts={quickPromptCandidates}
          initialHistory={dashboardChatHistory}
          initialInput={
            fromDashboardOrdering && dashboardChatHistory.length === 0 && routeState?.intent === "ask"
              && !routeState?.chatHistoryId
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
      <OrderingHistorySection data={historyQuery.data} isLoading={historyQuery.isLoading} />
    </div>
  );
}
