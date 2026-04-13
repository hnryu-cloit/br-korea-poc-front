import type { ActorInfo, DateRangeParams } from "./interface_common";

/**
 * ProductionPage
 * - 5분 단위 재고 조회
 * - 1시간 후 예측
 * - 4주 평균 생산 패턴
 * - 생산 필요 시점 자동 감지
 * - 속도 이상 / 재료 위험 / PUSH 알림
 * - 생산 등록
 * - 찬스 로스 효과
 * - 품절 처리 제안
 */

export type ProductionStatus = "danger" | "warning" | "safe";

/**
 * SKU별 생산 모니터링 항목
 */
export interface ProductionSkuItem {
  sku_id: string; // SKU 고유 ID
  sku_name: string; // 상품명
  current_stock: number; // 현재 재고 수량
  forecast_stock_1h: number; // 1시간 후 예상 재고 수량
  avg_first_production_qty_4w: number; // 최근 4주 기준 평균 1차 생산 수량
  avg_first_production_time_4w: string; // 최근 4주 기준 평균 1차 생산 시각
  avg_second_production_qty_4w: number; // 최근 4주 기준 평균 2차 생산 수량
  avg_second_production_time_4w: string; // 최근 4주 기준 평균 2차 생산 시각
  status: ProductionStatus; // 재고 위험 상태
  chance_loss_saving_pct: number; // 지금 생산 시 기대되는 찬스 로스 절감 비율
  chance_loss_basis_text?: string; // 찬스 로스 계산 근거 설명
  speed_alert?: boolean; // 판매 속도 이상 감지 여부
  speed_alert_message?: string; // 판매 속도 이상 설명 문구
  material_alert?: boolean; // 재료 부족 위험 여부
  material_alert_message?: string; // 재료 부족 위험 설명 문구
  depletion_eta_minutes?: number | null; // 재고 소진까지 남은 예상 시간(분)
  recommended_production_qty?: number; // 추천 생산 수량
}

/**
 * 생산관리 상단 경고 알림
 */
export interface ProductionAlertItem {
  id: string; // 알림 고유 ID
  type: "inventory_risk" | "speed_risk" | "material_risk"; // 알림 유형
  severity: "high" | "medium"; // 알림 심각도
  title: string; // 알림 제목
  description: string; // 알림 설명
  sku_id?: string; // 관련 SKU ID
  ingredient_id?: string; // 관련 원재료 ID
  expected_at?: string; // 위험이 예상되는 시각
}

/**
 * 생산관리 상단 요약 통계
 */
export interface ProductionSummaryStat {
  key: "danger_count" | "warning_count" | "safe_count" | "chance_loss_saving_total"; // 통계 식별 키
  label: string; // 통계 라벨
  value: string; // 표시 값
  tone: "danger" | "primary" | "success" | "default"; // 강조 톤
}

/**
 * 생산관리 메인 조회
 * GET /api/production/overview
 */
export interface GetProductionOverviewRequest {
  store_id: string; // 조회 대상 매장 ID
}

export interface GetProductionOverviewResponse {
  updated_at: string; // 마지막 데이터 갱신 시각
  refresh_interval_minutes: number; // 자동 새로고침 주기(분)
  summary_stats: ProductionSummaryStat[]; // 상단 요약 통계
  alerts: ProductionAlertItem[]; // 긴급/주의 알림 목록
  items: ProductionSkuItem[]; // SKU별 생산 현황 목록
}

/**
 * 생산 등록 모달 상세
 * GET /api/production/registrations/form
 */
export interface GetProductionRegistrationFormRequest {
  store_id: string; // 조회 대상 매장 ID
  sku_id: string; // 생산 등록할 SKU ID
}

export interface GetProductionRegistrationFormResponse {
  sku_id: string; // 생산 등록 대상 SKU ID
  sku_name: string; // 생산 등록 대상 상품명
  current_stock: number; // 현재 재고 수량
  forecast_stock_1h: number; // 1시간 후 예상 재고 수량
  recommended_qty: number; // 기본 추천 생산 수량
  chance_loss_saving_pct: number; // 추천 수량대로 생산 시 예상 찬스 로스 절감 비율
  chance_loss_basis_text: string; // 추천 수량 계산 근거 설명
  material_alert?: boolean; // 재료 부족 위험 여부
  material_alert_message?: string; // 재료 위험 안내 문구
}

/**
 * 생산 등록 저장
 * POST /api/production/registrations
 */
export interface CreateProductionRegistrationRequest extends ActorInfo {
  store_id: string; // 생산 등록이 발생한 매장 ID
  sku_id: string; // 생산 등록 대상 SKU ID
  qty: number; // 실제 생산 등록 수량
  registered_at?: string; // 생산 등록 시각
}

export interface CreateProductionRegistrationResponse {
  registration_id: string; // 생성된 생산 등록 ID
  sku_id: string; // 생산 등록된 SKU ID
  qty: number; // 저장된 생산 수량
  feedback_type: "chance_loss_reduced" | "late_registration" | "neutral"; // 등록 결과 피드백 유형
  feedback_message: string; // 등록 직후 노출할 피드백 문구
  chance_loss_saving_pct?: number; // 생산 등록으로 기대되는 찬스 로스 절감 비율
}

/**
 * 생산 등록 이력
 * GET /api/production/registrations/history
 */
export interface GetProductionRegistrationHistoryRequest extends DateRangeParams {
  limit?: number; // 최대 조회 건수
}

/**
 * 생산 등록 이력 항목
 */
export interface ProductionRegistrationHistoryItem {
  registration_id: string; // 생산 등록 이력 ID
  sku_id: string; // 생산 등록된 SKU ID
  sku_name: string; // 생산 등록된 상품명
  qty: number; // 등록 수량
  registered_at: string; // 등록 시각
  actor_role: string; // 등록을 수행한 사용자 역할
  feedback_type: string; // 저장 당시 피드백 유형
  feedback_message: string; // 저장 당시 피드백 문구
}

export interface GetProductionRegistrationHistoryResponse {
  items: ProductionRegistrationHistoryItem[]; // 생산 등록 이력 목록
  total: number; // 전체 이력 건수
}

/**
 * 생산 등록 요약
 * GET /api/production/registrations/summary
 */
export interface GetProductionRegistrationSummaryRequest extends DateRangeParams {}

export interface GetProductionRegistrationSummaryResponse {
  recent_registration_count_7d: number; // 최근 7일 생산 등록 건수
  recent_registered_qty_7d: number; // 최근 7일 총 생산 등록 수량
  affected_sku_count: number; // 최근 기간 동안 생산 등록된 SKU 수
  latest_registration?: ProductionRegistrationHistoryItem | null; // 가장 최근 생산 등록 이력
}

/**
 * 품절 처리 제안
 * GET /api/production/soldout-suggestions
 */
export interface GetSoldOutSuggestionsRequest {
  store_id: string; // 조회 대상 매장 ID
}

/**
 * 품절 처리 제안 항목
 */
export interface SoldOutSuggestionItem {
  sku_id: string; // 품절 처리 제안 대상 SKU ID
  sku_name: string; // 품절 처리 제안 대상 상품명
  suggestion_reason: string; // 품절 처리 제안 사유
  channels: Array<{
    channel_code: string; // 판매 채널 코드
    channel_name: string; // 판매 채널명
    current_status: "active" | "soldout" | "unknown"; // 현재 채널 노출 상태
    suggested_action: "mark_soldout" | "keep_active"; // 채널별 권장 조치
  }>;
}

export interface GetSoldOutSuggestionsResponse {
  items: SoldOutSuggestionItem[]; // 품절 처리 제안 목록
}
