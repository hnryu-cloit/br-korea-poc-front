import {
  ROUTE_STYLE,
  ROUTE_LABEL,
  QUERY_TYPE_STYLE,
  QUERY_TYPE_LABEL,
} from "@/commons/constants/audit-route";
import type { SalesV2HintItem } from "@/features/sales/types/sales-v2";

export const SALES_V2_ROUTE_STYLE = ROUTE_STYLE;
export const SALES_V2_ROUTE_LABEL = ROUTE_LABEL;
export const SALES_V2_QUERY_TYPE_STYLE = QUERY_TYPE_STYLE;
export const SALES_V2_QUERY_TYPE_LABEL = QUERY_TYPE_LABEL;

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
