export const PROCESSING_ROUTE = {
  REPOSITORY: "stub_repository",
  AI: "ai_proxy",
  BLOCK: "policy_block",
} as const;

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

export const QUERY_TYPE_LABEL: Record<string, string> = {
  faq: "FAQ",
  data_lookup: "데이터 조회",
  analysis: "분석",
  sensitive_request: "민감정보",
};

export const QUERY_TYPE_STYLE: Record<string, string> = {
  faq: "bg-slate-100 text-slate-600",
  data_lookup: "bg-[#eef4ff] text-[#2454C8]",
  analysis: "bg-orange-50 text-orange-600",
  sensitive_request: "bg-red-50 text-red-600",
};
