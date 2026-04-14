import type { ActorInfo, DateRangeParams } from "@/type/common";

/**
 * OrderingPage
 * - 주문 마감 카운트다운
 * - 주문 누락 방지 원칙
 * - 추천 3안 비교
 * - 추천 근거 수치/문장
 * - 날씨/행사/특수일 반영
 * - 점주 최종 확정 및 이력 복원
 */

/**
 * 주문 추천안 근거 수치 항목
 */
export interface OrderingOptionMetric {
  key: string; // 근거 지표명
  value: string; // 지표 값
}

/**
 * 주문 추천안 품목별 수량 라인
 */
export interface OrderingOptionItemLine {
  sku_id?: string; // SKU 고유 ID
  sku_name: string; // 상품명
  quantity: number; // 주문 추천 수량
  note?: string; // 품목별 보정 또는 참고 메모
}

/**
 * 주문 추천안 카드
 */
export interface OrderingOptionItem {
  option_id: string; // 추천안 고유 ID
  title: string; // 추천안 제목
  basis: string; // 추천안 산정 기준 요약
  description: string; // 추천안 설명
  recommended: boolean; // AI 기본 추천안 여부
  reasoning_text: string; // 추천안 근거 설명 문장
  reasoning_metrics: OrderingOptionMetric[]; // 추천안 판단 근거 수치 목록
  special_factors: string[]; // 날씨, 행사, 조기 품절 등 예외 변수 목록
  items: OrderingOptionItemLine[]; // 추천안에 포함된 품목별 주문 수량
}

/**
 * 주문 추천 메인 조회
 * GET /api/ordering/options
 */
export interface GetOrderingOptionsRequest {
  store_id: string; // 조회 대상 매장 ID
  notification_entry?: boolean; // 알림 진입 여부
}

export interface GetOrderingOptionsResponse {
  deadline_minutes: number; // 주문 마감까지 남은 시간(분)
  deadline_at?: string; // 주문 마감 시각
  notification_entry: boolean; // 알림을 통해 진입했는지 여부
  purpose_text: string; // 주문 화면의 운영 목적 설명
  caution_text: string; // 최종 결정 책임에 대한 안내 문구
  weather_summary?: string; // 주문 판단에 반영된 날씨 요약
  trend_summary?: string; // 최근 판매 추세 요약
  business_date?: string; // 기준 영업일
  options: OrderingOptionItem[]; // 비교 가능한 주문 추천안 목록
}

/**
 * 주문 선택 저장
 * POST /api/ordering/selections
 */
export interface CreateOrderSelectionRequest extends ActorInfo {
  store_id: string; // 주문을 확정한 매장 ID
  option_id: string; // 선택한 추천안 ID
  reason?: string; // 점주가 입력한 선택 사유
  selected_at?: string; // 주문 확정 시각
}

export interface CreateOrderSelectionResponse {
  selection_id: string; // 생성된 주문 선택 이력 ID
  option_id: string; // 저장된 추천안 ID
  saved: boolean; // 저장 성공 여부
  reason?: string | null; // 저장된 선택 사유
}

/**
 * 주문 선택 이력
 * GET /api/ordering/selections/history
 */
export interface GetOrderSelectionHistoryRequest extends DateRangeParams {
  limit?: number; // 최대 조회 건수
}

/**
 * 주문 선택 이력 항목
 */
export interface OrderSelectionHistoryItem {
  selection_id: string; // 주문 선택 이력 ID
  option_id: string; // 선택한 추천안 ID
  option_title?: string; // 선택한 추천안 제목
  actor_role: string; // 선택을 수행한 사용자 역할
  reason?: string | null; // 점주가 입력한 선택 사유
  selected_at: string; // 주문 확정 시각
}

export interface GetOrderSelectionHistoryResponse {
  items: OrderSelectionHistoryItem[]; // 주문 선택 이력 목록
  total: number; // 전체 이력 건수
}

/**
 * 주문 선택 요약 및 상태 복원
 * GET /api/ordering/selections/summary
 */
export interface GetOrderSelectionSummaryRequest extends DateRangeParams {}

export interface GetOrderSelectionSummaryResponse {
  latest?: OrderSelectionHistoryItem | null; // 가장 최근 주문 선택 이력
  recent_selection_count_7d: number; // 최근 7일 주문 확정 건수
  recommended_selected: boolean; // 최근 선택이 AI 추천안인지 여부
  option_counts: Record<string, number>; // 추천안별 선택 횟수 집계
}
