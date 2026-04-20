import axiosInstance from "@/services/axiosInstance";

import type {
  OrderingAlertsParams,
  OrderingAlertsResponse,
  OrderingContextPath,
  OrderingContextResponse,
  OrderingDeadlineParams,
  OrderingDeadlineResponse,
  OrderingHistoryParams,
  OrderingHistoryResponse,
  OrderingOptionsParams,
  OrderingOptionsResponse,
  OrderingSelectionHistoryParams,
  OrderingSelectionHistoryResponse,
  OrderingSelectionPayload,
  OrderingSelectionResponse,
  OrderingSelectionSummaryParams,
  OrderingSelectionSummaryResponse,
} from "@/features/ordering/types/ordering";

// 주문 추천 옵션 -> 주문 추천 옵션 3종 조회
export const getOrderingOptions = async (params?: OrderingOptionsParams) => {
  const response = await axiosInstance.get<OrderingOptionsResponse>("/api/ordering/options", {
    params,
  });
  return response.data;
};

// 알림 기반 주문 컨텍스트 -> 알림 진입 시 포커스 옵션 결정
export const getOrderingContext = async ({ notification_id }: OrderingContextPath) => {
  const response = await axiosInstance.get<OrderingContextResponse>(
    `/api/ordering/context/${notification_id}`,
  );
  return response.data;
};

// 주문 알림 -> 주문 마감 알림 목록
export const getOrderingAlerts = async (params?: OrderingAlertsParams) => {
  const response = await axiosInstance.get<OrderingAlertsResponse>("/api/ordering/alerts", {
    params,
  });
  return response.data;
};

// 주문 선택 저장 -> 점주 최종 주문 선택 저장
export const postOrderingSelection = async (payload: OrderingSelectionPayload) => {
  const response = await axiosInstance.post<OrderingSelectionResponse>(
    "/api/ordering/selections",
    payload,
  );
  return response.data;
};

// 주문 선택 이력 조회
export const getOrderingSelectionHistory = async (params?: OrderingSelectionHistoryParams) => {
  const response = await axiosInstance.get<OrderingSelectionHistoryResponse>(
    "/api/ordering/selections/history",
    { params },
  );
  return response.data;
};

// 주문 마감까지 남은 정보 조회
export const getOrderingDeadline = async (params?: OrderingDeadlineParams) => {
  const response = await axiosInstance.get<OrderingDeadlineResponse>("/api/ordering/deadline", {
    params,
  });
  return response.data;
};

// 주문 요약 카드 조회
export const getOrderingSelectionSummary = async (params?: OrderingSelectionSummaryParams) => {
  const response = await axiosInstance.get<OrderingSelectionSummaryResponse>(
    "/api/ordering/selections/summary",
    { params },
  );
  return response.data;
};

// 발주 이력 조회
export const getOrderingHistory = async (storeId: string, limit = 30) => {
  const params: OrderingHistoryParams = { store_id: storeId, limit };
  const response = await axiosInstance.get<OrderingHistoryResponse>("/api/ordering/history", {
    params,
  });
  return response.data;
};
