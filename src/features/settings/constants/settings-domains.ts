import type { DomainPromptSettings, SettingsDomain } from "@/features/settings/types/settings";

export const SETTINGS_DOMAINS: { key: SettingsDomain; label: string; description: string }[] = [
  { key: "production", label: "생산관리", description: "생산 알람 및 재고 분석 AI 지시문" },
  { key: "ordering", label: "주문관리", description: "주문 추천 및 마감 대응 AI 지시문" },
  { key: "sales", label: "손익분석", description: "매출·손익 분석 채팅 AI 지시문" },
];

export const DEFAULT_DOMAIN_SETTINGS: DomainPromptSettings = {
  quick_prompts: [],
  system_instruction: "",
  query_prefix_template: "",
};