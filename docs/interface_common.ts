/**
 * 공통 API 인터페이스 초안
 * 기준:
 * - onepager.md
 * - feature-list-front.csv
 * - 현재 구현된 Dashboard / Production / Ordering / Sales / Analytics UI
 */

export type ApiMeta = {
  request_id?: string; // 요청 추적용 고유 ID
  timestamp?: string; // 응답 생성 시각 (ISO datetime)
};

export type ApiResponse<T> = {
  data: T; // 실제 응답 본문 데이터
  meta?: ApiMeta; // 공통 메타데이터
};

export type DateRangeParams = {
  store_id: string; // 조회 대상 매장 ID
  date_from?: string; // 조회 시작일 또는 시작 시각
  date_to?: string; // 조회 종료일 또는 종료 시각
};

export type ActorInfo = {
  actor_id?: string; // 요청을 수행한 사용자 ID
  actor_role: "store_owner" | "store_staff" | "hq_admin" | "hq_operator"; // 요청 주체 역할
};

/**
 * 공통 알림
 * 사용 페이지:
 * - Header 알림 인박스
 * - 홈 알림 섹션
 * - 알림 딥링크 이동
 */
export type NotificationCategory = "alert" | "workflow" | "analysis";

export type NotificationLink = {
  path: string; // 알림 클릭 시 이동할 앱 경로
  focus_section?: string; // 이동 후 강조할 화면 섹션 키
  focus_id?: string; // 이동 후 포커싱할 특정 항목 ID
  context?: Record<string, string | number | boolean>; // 딥링크 후처리에 사용할 추가 문맥 값
};

/**
 * 공통 알림 항목
 */
export interface NotificationItem {
  id: number; // 알림 고유 ID
  category: NotificationCategory; // 알림 분류
  title: string; // 알림 제목
  description: string; // 알림 상세 설명
  created_at: string; // 알림 생성 시각
  unread: boolean; // 미확인 여부
  link?: NotificationLink | null; // 알림 클릭 시 연결할 대상 정보
}

/**
 * 알림 목록 조회 응답
 */
export interface GetNotificationsResponse {
  items: NotificationItem[]; // 알림 목록
  unread_count: number; // 전체 미확인 알림 수
}

/**
 * 알림 읽음 처리 요청
 */
export interface MarkNotificationsReadRequest {
  notification_ids: number[]; // 읽음 처리할 알림 ID 목록
}

/**
 * 알림 읽음 처리 응답
 */
export interface MarkNotificationsReadResponse {
  updated_count: number; // 이번 요청으로 읽음 처리된 알림 수
  unread_count: number; // 처리 후 남은 미확인 알림 수
}

/**
 * 공통 AI 컨텍스트
 * 사용 페이지:
 * - 홈 카드별 컨텍스트 챗
 * - 생산/주문/손익 상세 페이지 AI 질문 버튼
 */
export type ContextDomain = "dashboard" | "production" | "ordering" | "sales";

/**
 * 페이지별 AI 프롬프트 조회 요청
 */
export interface GetContextPromptsRequest {
  domain: ContextDomain; // 프롬프트를 가져올 화면 도메인
  store_id: string; // 프롬프트 문맥을 맞출 매장 ID
}

/**
 * AI 질문 버튼에 노출할 프롬프트 항목
 */
export interface ContextPromptItem {
  id: string; // 프롬프트 고유 ID
  label: string; // 버튼에 노출할 짧은 질문 라벨
  prompt: string; // 실제 AI에 전달할 질문 문장
}

/**
 * 페이지별 AI 프롬프트 조회 응답
 */
export interface GetContextPromptsResponse {
  domain: ContextDomain; // 응답이 속한 화면 도메인
  title: string; // 프롬프트 묶음 제목
  prompts: ContextPromptItem[]; // 화면 문맥에 맞는 추천 프롬프트 목록
}
