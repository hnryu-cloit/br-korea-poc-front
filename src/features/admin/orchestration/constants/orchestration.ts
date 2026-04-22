import { Bot, Bell, Database, FileText, GitBranch, KeyRound, Shield, Sparkles, Star } from "lucide-react";

import type { PromptDomainKey, SettingsPanelKey } from "@/features/admin/orchestration/types/orchestration";

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

export const AGENT_TABS: { key: PromptDomainKey; label: string; chipTone: string }[] = [
  { key: "production", label: "생산관리 Agent", chipTone: "bg-emerald-100 text-emerald-700" },
  { key: "ordering", label: "주문관리 Agent", chipTone: "bg-blue-100 text-blue-700" },
  { key: "sales", label: "매출관리 Agent", chipTone: "bg-orange-100 text-orange-700" },
];

type SidebarItem = {
  key: SettingsPanelKey;
  label: string;
  icon: typeof Bot;
  pill?: string;
  pillTone?: "blue" | "amber" | "red";
};

export const SIDEBAR_GROUPS: { label: string; items: SidebarItem[] }[] = [
  {
    label: "에이전트 관리",
    items: [
      { key: "agents", label: "Agent 레지스트리", icon: Bot, pill: "3", pillTone: "blue" },
      { key: "orch", label: "오케스트레이션", icon: GitBranch },
    ],
  },
  {
    label: "시스템 설정",
    items: [
      { key: "connectors", label: "데이터 커넥터", icon: Database, pill: "1", pillTone: "amber" },
      { key: "rbac", label: "RBAC & 접근 제어", icon: KeyRound },
      { key: "prompts", label: "AI 프롬프트 설정", icon: Sparkles },
      { key: "golden", label: "골든 쿼리 관리", icon: Star, pill: "7", pillTone: "red" },
    ],
  },
  {
    label: "모니터링",
    items: [
      { key: "audit", label: "대화 감사 로그", icon: FileText, pill: "1", pillTone: "red" },
      { key: "quality", label: "품질 검증 아카이브", icon: Shield },
    ],
  },
  {
    label: "공지",
    items: [{ key: "notices", label: "공지사항", icon: Bell, pill: "2", pillTone: "red" }],
  },
];

export const PANEL_PATH_MAP: Record<SettingsPanelKey, string> = {
  agents: "/settings",
  orch: "/settings/orchestration",
  connectors: "/settings/connectors",
  rbac: "/settings/access",
  prompts: "/settings/prompts",
  golden: "/settings/golden-queries",
  audit: "/settings/audit-logs",
  quality: "/settings/quality-archive",
  notices: "/settings/notices",
};

export const PATH_PANEL_MAP: Record<string, SettingsPanelKey> = Object.fromEntries(
  Object.entries(PANEL_PATH_MAP).map(([key, path]) => [path, key as SettingsPanelKey]),
);