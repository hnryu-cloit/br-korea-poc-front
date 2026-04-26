import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { PAGE_CAPTIONS } from "@/commons/constants/field-captions";
import { OrderingConfirmedSummary } from "@/features/ordering/components/OrderingConfirmedSummary";
import { OrderingContextCards } from "@/features/ordering/components/OrderingContextCards";
import { OrderingDeadlineAlert } from "@/features/ordering/components/OrderingDeadlineAlert";
import { OrderingOptionsSection } from "@/features/ordering/components/OrderingOptionsSection";
import {
  OrderingContextCardsSkeleton,
  OrderingDeadlineAlertSkeleton,
  OrderingOptionsSectionSkeleton,
} from "@/features/ordering/components/OrderingSkeletons";
import { useOrderingCountdown } from "@/features/ordering/hooks/useOrderingCountdown";
import { useGetOrderingActiveCampaignsQuery } from "@/features/ordering/queries/useGetOrderingActiveCampaignsQuery";
import { useGetOrderingContextQuery } from "@/features/ordering/queries/useGetOrderingContextQuery";
import { useGetOrderingOptionsQuery } from "@/features/ordering/queries/useGetOrderingOptionsQuery";
import { usePostOrderingSelectionMutation } from "@/features/ordering/queries/usePostOrderingSelectionMutation";
import type { OrderingDeadlineItem } from "@/features/ordering/types/ordering";

function todayString() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

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
  const [campaignReferenceDate, setCampaignReferenceDate] = useState<string>(todayString);

  const optionsQuery = useGetOrderingOptionsQuery({ notification_entry: notificationEntry });
  const activeCampaignsQuery = useGetOrderingActiveCampaignsQuery({
    reference_date: campaignReferenceDate,
    limit: 3,
  });

  const contextQuery = useGetOrderingContextQuery(notificationId);
  const postOrderingSelectionMutation = usePostOrderingSelectionMutation();
  const optionsLoading = optionsQuery.isLoading && !optionsQuery.data;
  const contextLoading = notificationEntry && contextQuery.isLoading && !contextQuery.data;

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
  const deadlineItems = useMemo(() => {
    const fromApi = optionsQuery.data?.deadline_items ?? [];
    if (fromApi.length > 0) {
      return fromApi;
    }

    const candidates: OrderingDeadlineItem[] = [];
    const seen = new Set<string>();
    orderingOptions.forEach((option) => {
      option.items.forEach((item) => {
        const note = String(item.note ?? "");
        const matched = note.match(/마감\s*([0-2]?\d:[0-5]\d)/);
        if (!matched) {
          return;
        }
        const [hour, minute] = matched[1].split(":");
        const normalizedDeadline = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
        const key = (item.sku_id ?? "").trim() || item.sku_name.trim();
        if (!key || seen.has(key)) {
          return;
        }
        seen.add(key);
        candidates.push({
          id: key,
          sku_name: item.sku_name,
          deadline_at: normalizedDeadline,
          is_ordered: false,
        });
      });
    });
    return candidates;
  }, [optionsQuery.data?.deadline_items, orderingOptions]);
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
      <div className="mb-8">
        <h2 className="text-[#41352E] text-[24px] font-bold">주문 관리</h2>
        <p className="mt-1 text-sm text-slate-500">
          {PAGE_CAPTIONS["ordering:recommendations"].subtitle}
        </p>
      </div>
      {optionsLoading || contextLoading ? (
        <>
          <OrderingContextCardsSkeleton />
          <OrderingDeadlineAlertSkeleton />
          <OrderingOptionsSectionSkeleton />
        </>
      ) : (
        <>
          <OrderingContextCards
            businessDate={optionsQuery.data?.business_date}
            weather={optionsQuery.data?.weather}
            campaigns={activeCampaignsQuery.data?.items ?? []}
            referenceDate={campaignReferenceDate}
            onChangeReferenceDate={setCampaignReferenceDate}
            isCampaignsLoading={activeCampaignsQuery.isLoading}
          />
          <OrderingDeadlineAlert deadlineItems={deadlineItems} />
          <OrderingOptionsSection
            options={orderingOptions}
            selectedOptionId={effectiveSelectedOptionId}
            onSelectOption={setSelectedOptionId}
            onConfirm={handleConfirm}
            isSubmitting={postOrderingSelectionMutation.isPending}
            errorMessage={submitError}
          />
        </>
      )}
    </div>
  );
}
