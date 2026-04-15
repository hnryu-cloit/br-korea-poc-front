import type { QueryCategory } from "@/features/analytics/types/analytics-screen";

export const ANALYTICS_CATEGORIES: QueryCategory[] = [
  "전체",
  "FAQ",
  "데이터 조회",
  "분석",
  "민감정보",
];

export const QUERY_TYPE_LABEL: Record<string, QueryCategory> = {
  faq: "FAQ",
  data_lookup: "데이터 조회",
  analysis: "분석",
  sensitive_request: "민감정보",
};

export const ROUTE_LABEL: Record<string, string> = {
  stub_repository: "SQL/API",
  ai_proxy: "AI",
  policy_block: "차단",
};

export const ROUTE_STYLE: Record<string, string> = {
  stub_repository: "bg-[#eef4ff] text-[#2454C8]",
  ai_proxy: "bg-orange-50 text-orange-600",
  policy_block: "bg-red-50 text-red-600",
};
