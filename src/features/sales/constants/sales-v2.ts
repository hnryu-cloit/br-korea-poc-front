import type { SalesV2HintItem } from "@/features/sales/types/sales-v2";

export const SALES_V2_ROUTE_STYLE: Record<string, string> = {
  ai_proxy: "bg-orange-50 text-orange-600",
  stub_repository: "bg-[#eef4ff] text-[#2454C8]",
  policy_block: "bg-red-50 text-red-600",
};

export const SALES_V2_ROUTE_LABEL: Record<string, string> = {
  ai_proxy: "AI",
  stub_repository: "SQL/API",
  policy_block: "차단",
};

export const SALES_V2_QUERY_TYPE_STYLE: Record<string, string> = {
  analysis: "bg-orange-50 text-orange-600",
  data_lookup: "bg-[#eef4ff] text-[#2454C8]",
  faq: "bg-slate-100 text-slate-600",
  sensitive_request: "bg-red-50 text-red-600",
};

export const SALES_V2_QUERY_TYPE_LABEL: Record<string, string> = {
  analysis: "분석",
  data_lookup: "데이터 조회",
  faq: "FAQ",
  sensitive_request: "민감정보",
};

export const SALES_V2_HINT_QUESTIONS: SalesV2HintItem[] = [
  {
    q: "어떻게 물어보면 되나요?",
    a: "평소 말하듯이 입력하시면 돼요. 예를 들어 '이번 주 배달이 왜 줄었나요?' 처럼 입력하면 분석해 드려요.",
  },
  {
    q: "오른쪽 버튼은 뭔가요?",
    a: "자주 묻는 질문들이에요. 버튼을 누르면 바로 분석해 드려요. 직접 입력하기 어려우시면 눌러보세요.",
  },
];
