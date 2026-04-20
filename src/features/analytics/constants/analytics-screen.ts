import { ROUTE_LABEL, ROUTE_STYLE, QUERY_TYPE_LABEL } from "@/commons/constants/audit-route";
import type { QueryCategory } from "@/features/analytics/types/analytics-screen";

export { ROUTE_LABEL, ROUTE_STYLE, QUERY_TYPE_LABEL };

export const ANALYTICS_CATEGORIES: QueryCategory[] = [
  "전체",
  "FAQ",
  "데이터 조회",
  "분석",
  "민감정보",
];
