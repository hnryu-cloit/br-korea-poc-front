import axiosInstance from "@/services/axiosInstance";
import { orderingOptions as orderingOptionMocks } from "@/features/ordering/constants/ordering";

import type {
  OrderingAlertsParams,
  OrderingAlertsResponse,
  OrderingContextPath,
  OrderingContextResponse,
  OrderingDeadlineParams,
  OrderingDeadlineResponse,
  OrderingOptionsParams,
  OrderingOptionsResponse,
  OrderingSelectionHistoryParams,
  OrderingSelectionHistoryResponse,
  OrderingSelectionPayload,
  OrderingSelectionResponse,
  OrderingSelectionSummaryParams,
  OrderingSelectionSummaryResponse,
} from "@/features/ordering/types/ordering";

const USE_ORDERING_MOCK = true;

const orderingMockOptions: OrderingOptionsResponse["options"] = orderingOptionMocks.map((option, index) => ({
  option_id: option.id,
  title: option.title,
  basis: option.basis,
  description: option.description,
  recommended: option.recommended ?? false,
  reasoning_text: option.reasoning,
  reasoning_metrics: option.metrics,
  special_factors: option.specialFactors ?? [],
  items: option.items.map((item) => ({
    sku_name: item.name,
    quantity: item.quantity,
    note: index === 0 ? "추천 상위 SKU" : null,
  })),
}));

// 주문 추천 옵션 -> 주문 추천 옵션 3종 조회 
export const getOrderingOptions = async (params?: OrderingOptionsParams) => {
  if (USE_ORDERING_MOCK) {
    return {
      deadline_minutes: 17,
      deadline_at: "14:00",
      notification_entry: Boolean(params?.notification_entry),
      purpose_text: "주문 누락을 방지하고 최적 수량을 선택하세요.",
      caution_text: "최종 주문 결정은 점주 권한입니다. 추천 옵션은 보조 자료로만 활용해주세요.",
      weather_summary: "맑음, 22°C",
      trend_summary: "최근 3주 +12% 증가",
      business_date: "2026-04-06",
      options: orderingMockOptions,
    };
  }
  const response = await axiosInstance.get<OrderingOptionsResponse>(
    "/api/ordering/options",
    { params },
  );
  return response.data;
};

// 알림 기반 주문 컨텍스트 -> 알림 진입 시 포커스 옵션 결정
export const getOrderingContext = async ({ notification_id }: OrderingContextPath) => {
  // if (USE_ORDERING_MOCK) {
  //   return {
  //     notification_id,
  //     target_path: "/ordering",
  //     focus_option_id: orderingMockOptions.find((option) => option.recommended)?.option_id ?? orderingMockOptions[0]?.option_id ?? null,
  //     message: "주문 추천 3개 옵션이 준비되었습니다. 추천 옵션부터 확인하세요.",
  //   };
  // }
  const response = await axiosInstance.get<OrderingContextResponse>(
    `/api/ordering/context/${notification_id}`,
  );
  return response.data;
};

// 주문 알림 -> 주문 마감 알림 목록 
export const getOrderingAlerts = async (params?: OrderingAlertsParams) => {
  // if (USE_ORDERING_MOCK) {
  //   const beforeMinutes = params?.before_minutes ?? 20;
  //   const focusOption = orderingMockOptions.find((option) => option.recommended) ?? orderingMockOptions[0];
  //   return {
  //     generated_at: "2026-04-06 13:43:10",
  //     alerts: focusOption
  //       ? [
  //           {
  //             notification_id: 2,
  //             title: `주문 마감 ${beforeMinutes}분 전입니다`,
  //             message: `${focusOption.title} 옵션을 우선 확인해 주세요.`,
  //             deadline_minutes: beforeMinutes,
  //             target_path: "/ordering",
  //             focus_option_id: focusOption.option_id,
  //             target_roles: ["store_owner"],
  //           },
  //         ]
  //       : [],
  //   };
  // }
  const response = await axiosInstance.get<OrderingAlertsResponse>(
    "/api/ordering/alerts",
    { params },
  );
  return response.data;
};

// 주문 선택 저장 -> 점주 최종 주문 선택 저장 
export const postOrderingSelection = async (
  payload: OrderingSelectionPayload,
) => {
  if (USE_ORDERING_MOCK) {
    return {
      selection_id: `sel-${payload.option_id}-140301`,
      option_id: payload.option_id,
      reason: payload.reason ?? null,
      saved: true,
    };
  }
  const response = await axiosInstance.post<OrderingSelectionResponse>(
    "/api/ordering/selections",
    payload,
  );
  return response.data;
};

// 주문 선택 이력 조회 
export const getOrderingSelectionHistory = async (
  params?: OrderingSelectionHistoryParams,
) => {
  // if (USE_ORDERING_MOCK) {
  //   const option = orderingMockOptions.find((item) => item.recommended) ?? orderingMockOptions[0];
  //   return {
  //     items: option
  //       ? [
  //           {
  //             selection_id: "sel-opt-a-140301",
  //             option_id: option.option_id,
  //             option_title: option.title,
  //             actor_role: "store_owner",
  //             reason: "최근 추세와 날씨 기준으로 안전하게 선택",
  //             selected_at: "2026-04-06 13:49:12",
  //           },
  //         ]
  //       : [],
  //     total: option ? 1 : 0,
  //     filtered_store_id: params?.store_id ?? null,
  //     filtered_date_from: params?.date_from ?? null,
  //     filtered_date_to: params?.date_to ?? null,
  //   };
  // }
  const response = await axiosInstance.get<OrderingSelectionHistoryResponse>(
    "/api/ordering/selections/history",
    { params },
  );
  return response.data;
};

// 주문 마감까지 남은 정보 조회 
export const getOrderingDeadline = async (params?: OrderingDeadlineParams) => {
  // if (USE_ORDERING_MOCK) {
  //   return {
  //     store_id: params?.store_id ?? "gangnam",
  //     deadline: "14:00",
  //     minutes_remaining: 17,
  //     is_urgent: true,
  //     is_passed: false,
  //   };
  // }
  const response = await axiosInstance.get<OrderingDeadlineResponse>(
    "/api/ordering/deadline",
    { params },
  );
  return response.data;
};

// 주문 요약 카드 조회 
export const getOrderingSelectionSummary = async (
  params?: OrderingSelectionSummaryParams,
) => {
  // if (USE_ORDERING_MOCK) {
  //   const option = orderingMockOptions.find((item) => item.recommended) ?? orderingMockOptions[0];
  //   return {
  //     total: option ? 1 : 0,
  //     latest: option
  //       ? {
  //           selection_id: "sel-opt-a-140301",
  //           option_id: option.option_id,
  //           option_title: option.title,
  //           actor_role: "store_owner",
  //           reason: "최근 추세와 날씨 기준으로 안전하게 선택",
  //           selected_at: "2026-04-06 13:49:12",
  //         }
  //       : null,
  //     recommended_selected: true,
  //     recent_actor_roles: ["store_owner"],
  //     recent_selection_count_7d: 3,
  //     option_counts: option ? { [option.option_id]: 3 } : {},
  //     summary_status: option ? "recommended_selected" : "empty",
  //     filtered_store_id: params?.store_id ?? null,
  //     filtered_date_from: params?.date_from ?? null,
  //     filtered_date_to: params?.date_to ?? null,
  //   };
  // }
  const response = await axiosInstance.get<OrderingSelectionSummaryResponse>(
    "/api/ordering/selections/summary",
    { params },
  );
  return response.data;
};
