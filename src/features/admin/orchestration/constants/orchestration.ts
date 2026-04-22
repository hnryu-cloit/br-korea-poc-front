import type { PromptDomainKey } from "@/features/admin/orchestration/types/orchestration";

export const POLICY_ITEMS = [
  { label: "민감정보 마스킹", description: "매출, 손익, 생산량 원본 → 집계값 또는 차단" },
  { label: "역할 기반 접근 제어", description: "점주 / 운영 / 본사 조회 범위 분리 적용" },
  { label: "감사 로그 수집", description: "프롬프트, 응답, 라우팅 경로 감사 가능 저장" },
  { label: "RAG 출처 응답", description: "환각 위험 시 조회형 응답으로 다운그레이드" },
  { label: "LLM 호출 최소화", description: "정형 조회는 SQL/API 우선 처리, 토큰 추적" },
  { label: "퍼블릭 LLM 직접 전송 제한", description: "민감정보 마스킹 후 요약 컨텍스트만 전달" },
];

export const ORCHESTRATION_DOMAIN_KEYS: PromptDomainKey[] = ["production", "ordering", "sales"];

export const ORCHESTRATION_DOMAIN_LABEL: Record<PromptDomainKey, string> = {
  production: "생산관리",
  ordering: "주문관리",
  sales: "손익분석",
};

export type TwinTab = "prompt" | "data" | "logs" | "security";

export const TWIN_TABS: { key: TwinTab; label: string; description: string }[] = [
  { key: "prompt", label: "프롬프트 설정", description: "도메인별 AI 지시문/빠른질문 관리" },
  { key: "data", label: "데이터 설정", description: "데이터 처리·라우팅 지표 확인" },
  { key: "logs", label: "로그 관리", description: "감사 로그 조회 및 추적" },
  { key: "security", label: "보안 정책", description: "민감정보/권한 정책 상태 점검" },
];