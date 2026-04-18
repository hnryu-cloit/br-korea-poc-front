/**
 * AnalyticsPage
 * - 기존 analytics 페이지 유지용 API 스펙
 * - 지표 카드
 * - 질의 처리 로그
 */

/**
 * Analytics 지표 조회 요청
 */
export interface GetAnalyticsMetricsRequest {
  store_id?: string; // 필터링할 매장 ID
  date_from?: string; // 조회 시작일
  date_to?: string; // 조회 종료일
}

/**
 * Analytics 상단 지표 카드
 */
export interface AnalyticsMetricItem {
  label: string; // 지표명
  value: string; // 현재 지표 값
  change: string; // 이전 기준 대비 변화량 또는 변화율
  trend: "up" | "down" | "flat"; // 변화 방향
  detail: string; // 지표 보조 설명
}

export interface GetAnalyticsMetricsResponse {
  items: AnalyticsMetricItem[]; // 지표 카드 목록
}

/**
 * 감사 로그 조회 요청
 */
export interface GetAuditLogsRequest {
  domain?: string; // 필터링할 도메인명
  limit?: number; // 최대 조회 건수
}

/**
 * 질의 처리 감사 로그 항목
 */
export interface AuditLogItem {
  id: number; // 감사 로그 ID
  timestamp: string; // 로그 생성 시각
  domain: string; // 질의가 속한 도메인
  route: string; // 처리 경로 (예: SQL/API, AI, 차단)
  outcome: string; // 처리 결과
  message: string; // 로그 메시지
  metadata: Record<string, unknown>; // 질의 유형, 원문 등 추가 메타데이터
}

export interface GetAuditLogsResponse {
  items: AuditLogItem[]; // 감사 로그 목록
  total: number; // 전체 로그 건수
}

export type AnalyticsMetric = AnalyticsMetricItem;

export type AnalyticsMetricsResponse = GetAnalyticsMetricsResponse;

export interface AuditLogEntry extends AuditLogItem {
  event_type: string;
  actor_role: string;
}

export interface AuditLogListResponse extends GetAuditLogsResponse {
  items: AuditLogEntry[];
  filtered_domain?: string | null;
}

export interface StoreProfileResponse {
  store_cd: string;
  store_nm: string;
  sido: string;
  region: string;
  store_type: string;
  area_pyeong: number;
  business_type: string;
  peer_count: number;
  actual_sales_amt: number;
}

export interface CustomerSegmentItem {
  segment_nm: string;
  count: number;
}

export interface TelecomDiscountItem {
  name: string;
  type_nm: string;
  value: string;
  method_nm: string;
}

export interface CustomerProfileResponse {
  customer_segments: CustomerSegmentItem[];
  telecom_discounts: TelecomDiscountItem[];
}
