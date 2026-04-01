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
      { to: "/production", label: "생산 현황", icon: "bakery_dining" },
      { to: "/ordering", label: "주문 관리", icon: "shopping_cart" },
      { to: "/sales", label: "매출 현황", icon: "query_stats" },
    ],
  },
  {
    section: "분석",
    roles: ["store_owner", "hq_admin"],
    items: [{ to: "/analytics", label: "매출 조회", icon: "analytics" }],
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
];

export const routeDescriptions: Record<string, string> = {
  "/": "오늘 매장 운영 현황을 한눈에 확인합니다.",
  "/production": "지금 만들어야 할 품목을 확인합니다.",
  "/ordering": "오늘 주문할 수량을 선택합니다.",
  "/sales": "매출 현황과 분석 결과를 확인합니다.",
  "/analytics": "매출 데이터를 조회합니다.",
  "/hq/coaching": "담당 매장 주문 현황을 확인합니다.",
  "/hq/inspection": "매장별 생산 준수 현황을 점검합니다.",
  "/orchestration": "시스템 보안 정책 현황을 확인합니다.",
  "/signals": "전국 매장 매출 이상 신호를 확인합니다.",
};
