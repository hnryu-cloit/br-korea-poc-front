export type DemoRole = "hq_admin" | "store_owner";

export type MenuItem = {
  to: string;
  label: string;
  icon: string;
};

export type MenuSection = {
  section?: string;
  items: MenuItem[];
  roles?: DemoRole[];
};

export const menuSections: MenuSection[] = [
  {
    items: [{ to: "/", label: "홈", icon: "home" }],
  },
  {
    section: "매장 운영",
    roles: ["store_owner", "hq_admin"],
    items: [
      { to: "/production", label: "생산관리", icon: "bakery_dining" },
      { to: "/ordering", label: "주문 관리", icon: "shopping_cart" },
      { to: "/sales", label: "손익분석", icon: "query_stats" },
    ],
  },
  {
    section: "분석",
    roles: ["store_owner", "hq_admin"],
    items: [
      { to: "/analytics", label: "매출 조회", icon: "analytics" },
      { to: "/analytics/market", label: "상권·고객 분석", icon: "store" },
    ],
  },
  {
    section: "본사",
    roles: ["hq_admin"],
    items: [
      { to: "/hq/coaching", label: "주문 코칭", icon: "support_agent" },
      { to: "/hq/inspection", label: "생산 점검", icon: "inventory_2" },
    ],
  },
  {
    section: "본사",
    roles: ["hq_admin"],
    items: [
      { to: "/orchestration", label: "시스템 현황", icon: "shield_lock" },
      { to: "/signals", label: "매출 시그널", icon: "monitoring" },
    ],
  },
  {
    section: "관리",
    roles: ["hq_admin"],
    items: [
      { to: "/settings", label: "AI 설정", icon: "tune" },
    ],
  },
];

export const routeDescriptions: Record<string, string> = {
  "/": "오늘 매장 운영 현황을 한눈에 확인합니다.",
  "/production": "지금 생산해야 할 품목과 재고 예측을 확인합니다.",
  "/ordering": "주문 누락 방지를 위한 주문 추천안을 비교합니다.",
  "/sales": "순이익, 손익분기점, 매장 맞춤형 분석을 확인합니다.",
  "/analytics": "매출 데이터를 조회합니다.",
  "/analytics/market": "우리 매장 상권 특성과 주요 고객 유형을 확인합니다.",
  "/settings": "도메인별 AI 시스템 지시문과 추천 질문을 관리합니다.",
  "/hq/coaching": "담당 매장 주문 현황을 확인합니다.",
  "/hq/inspection": "매장별 생산 준수 현황을 점검합니다.",
  "/orchestration": "시스템 보안 정책 현황을 확인합니다.",
  "/signals": "전국 매장 매출 이상 신호를 확인합니다.",
};
