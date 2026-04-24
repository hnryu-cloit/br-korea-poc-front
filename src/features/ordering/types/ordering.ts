// GET /api/ordering/options
export interface OrderingOptionsParams {
  notification_entry?: boolean; // 알림에서 진입했는지 여부
}

export interface OrderingOptionItemLine {
  sku_id?: string; // SKU 식별자(없을 수 있음)
  sku_name: string; // 품목명
  quantity: number; // 추천 주문 수량(개)
  note?: string; // 품목 보정/참고 메모
}

export interface OrderingOptionMetric {
  key: string; // 지표명(예: 재고 소진율)
  value: string; // 지표값(예: 95%)
}

export interface OrderingOption {
  option_id: string; // 추천안 ID
  title: string; // 추천안 제목
  basis: string; // 산정 기준 요약
  description: string; // 추천안 설명
  recommended: boolean; // AI 추천안 여부
  reasoning_text: string; // 추천 근거 설명 문장
  reasoning_metrics: OrderingOptionMetric[]; // 추천 근거 수치 목록
  special_factors: string[]; // 예외 변수 반영 목록
  items: OrderingOptionItemLine[]; // 품목별 주문 라인
}

export interface OrderingWeather {
  region: string; // 기준 매장 지역
  forecast_date: string; // 예보 날짜(YYYY-MM-DD)
  weather_type: string; // 날씨 유형 라벨
  max_temperature_c?: number | null; // 최고 기온
  min_temperature_c?: number | null; // 최저 기온
  precipitation_probability?: number | null; // 강수확률
}

export interface OrderingOptionsResponse {
  deadline_minutes: number; // 주문 마감까지 남은 시간(분)
  deadline_at?: string; // 주문 마감 시각(없을 수 있음)
  notification_entry: boolean; // 알림 진입 여부(응답 반영값)
  purpose_text: string; // 화면 목적 안내 문구
  caution_text: string; // 점주 최종결정 안내 문구
  weather?: OrderingWeather | null; // 구조화된 날씨 정보
  trend_summary?: string; // 최근 트렌드 요약
  business_date?: string; // 기준 영업일
  deadline_items?: OrderingDeadlineItem[];
  options: OrderingOption[]; // 추천안 목록
}

// GET /api/ordering/context/{notification_id}
export interface OrderingContextPath {
  notification_id: number; // 알림 ID(path)
}

export interface OrderingContextResponse {
  notification_id: number; // 조회한 알림 ID
  target_path: string; // 이동 대상 경로
  focus_option_id?: string | null; // 강조할 추천안 ID
  message: string; // 컨텍스트 안내 문구
}

// GET /api/ordering/alerts
export interface OrderingAlertsParams {
  before_minutes?: number; // 몇 분 전 알림 기준(기본 20)
}

export interface OrderingDeadlineAlert {
  notification_id: number; // 알림 ID
  title: string; // 알림 제목
  message: string; // 알림 본문
  deadline_minutes: number; // 마감까지 남은 시간(분)
  target_path: string; // 알림 클릭 시 이동 경로
  focus_option_id?: string | null; // 강조 추천안 ID
  target_roles: string[]; // 알림 대상 역할 목록
}

export interface OrderingAlertsResponse {
  generated_at: string; // 생성 시각(YYYY-MM-DD HH:mm:ss)
  alerts: OrderingDeadlineAlert[]; // 알림 목록
}

// POST /api/ordering/selections
export interface OrderingSelectionPayload {
  option_id: string; // 선택한 추천안 ID
  reason?: string; // 선택 사유
  actor_role?: string; // 수행자 역할
  store_id?: string; // 매장 ID
}

export interface OrderingSelectionResponse {
  selection_id?: string | null; // 저장된 선택 이력 ID
  option_id: string; // 저장된 추천안 ID
  reason?: string | null; // 저장된 선택 사유
  saved: boolean; // 저장 성공 여부
}

// GET /api/ordering/selections/history
export interface OrderingSelectionHistoryParams {
  limit?: number; // 조회 건수 제한
  store_id?: string; // 매장 필터
  date_from?: string; // 시작일(YYYY-MM-DD)
  date_to?: string; // 종료일(YYYY-MM-DD)
}

export interface OrderingSelectionHistoryItem {
  selection_id?: string | null; // 선택 이력 ID
  option_id: string; // 선택한 추천안 ID
  option_title?: string | null; // 추천안 제목
  actor_role: string; // 수행자 역할
  reason?: string | null; // 선택 사유
  selected_at: string; // 선택 시각(YYYY-MM-DD HH:mm:ss)
}

export interface OrderingSelectionHistoryResponse {
  items: OrderingSelectionHistoryItem[]; // 이력 목록
  total: number; // 반환 총 건수
  filtered_store_id?: string | null; // 적용된 매장 필터
  filtered_date_from?: string | null; // 적용된 시작일 필터
  filtered_date_to?: string | null; // 적용된 종료일 필터
}

// GET /api/ordering/deadline
export interface OrderingDeadlineParams {
  store_id?: string; // 조회 대상 매장 ID
}

export interface OrderingDeadlineResponse {
  store_id: string; // 매장 ID
  deadline: string; // 마감 시각(HH:mm)
  minutes_remaining: number; // 마감까지 남은 분
  is_urgent: boolean; // 긴급 구간 여부(예: 20분 이내)
  is_passed: boolean; // 마감 경과 여부
}

export interface OrderingDeadlineItem {
  id: string;
  sku_name: string;
  deadline_at: string; // HH:mm
  is_ordered: boolean;
}

// GET /api/ordering/history
export interface OrderingHistoryParams {
  store_id?: string;
  limit?: number;
  page?: number;
  page_size?: number;
  date_from?: string;
  date_to?: string;
  item_nm?: string;
  is_auto?: boolean;
}

export interface OrderingHistoryItem {
  item_nm: string;
  dlv_dt?: string | null;
  ord_qty?: number | null;
  confrm_qty?: number | null;
  is_auto: boolean;
  ord_grp_nm?: string | null;
}

export interface OrderingHistoryResponse {
  items: OrderingHistoryItem[];
  auto_rate: number;
  manual_rate: number;
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface OrderingHistoryInsightKpi {
  key: string;
  label: string;
  value: string;
  tone: "default" | "primary" | "warning" | "danger" | "success";
}

export interface OrderingAnomalyItem {
  id: string;
  severity: "low" | "medium" | "high" | string;
  kind: string;
  message: string;
  recommended_action: string;
  related_items: string[];
}

export interface OrderingChangedItem {
  item_nm: string;
  avg_ord_qty: number;
  latest_ord_qty: number;
  change_ratio: number;
}

export interface OrderingHistoryInsightsResponse {
  kpis: OrderingHistoryInsightKpi[];
  anomalies: OrderingAnomalyItem[];
  top_changed_items: OrderingChangedItem[];
  sources?: string[];
  retrieved_contexts?: string[];
  confidence?: number | null;
}

// GET /api/ordering/selections/summary
export interface OrderingSelectionSummaryParams {
  store_id?: string; // 매장 필터
  date_from?: string; // 시작일(YYYY-MM-DD)
  date_to?: string; // 종료일(YYYY-MM-DD)
}

export interface OrderingSelectionSummaryResponse {
  total: number; // 전체 선택 건수
  latest?: OrderingSelectionHistoryItem | null; // 최신 선택 이력
  recommended_selected: boolean; // 최신 선택이 추천안인지 여부
  recent_actor_roles: string[]; // 최근 선택 역할 목록
  recent_selection_count_7d: number; // 최근 7일 선택 건수
  option_counts: Record<string, number>; // 추천안별 선택 횟수
  summary_status: string; // 요약 상태
  filtered_store_id?: string | null; // 적용된 매장 필터
  filtered_date_from?: string | null; // 적용된 시작일 필터
  filtered_date_to?: string | null; // 적용된 종료일 필터
}
