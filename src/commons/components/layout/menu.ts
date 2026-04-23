import balanceIcon from "@/assets/balance.svg";
import boxIcon from "@/assets/box.svg";
import chartIcon from "@/assets/chart.svg";
import chefIcon from "@/assets/chef.svg";
import dashboardIcon from "@/assets/dashboard.svg";
import deleteIcon from "@/assets/delete.svg";
import historyIcon from "@/assets/history.svg";
import mapIcon from "@/assets/map.svg";
import receiptIcon from "@/assets/receipt.svg";

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
    roles: ["store_owner", "hq_admin"],
    items: [{ to: "/dashboard", label: "홈", icon: dashboardIcon }],
  },
  {
    section: "생산",
    roles: ["store_owner", "hq_admin"],
    items: [
      { to: "/production/status", label: "생산 현황", icon: chefIcon },
      { to: "/production/waste-loss", label: "폐기 손실", icon: deleteIcon },
      { to: "/production/inventory-diagnosis", label: "재고 진단", icon: boxIcon },
    ],
  },
  {
    section: "주문",
    roles: ["store_owner", "hq_admin"],
    items: [
      { to: "/ordering/recommendations", label: "주문 관리", icon: receiptIcon },
      { to: "/ordering/history", label: "발주 이력", icon: historyIcon },
    ],
  },
  {
    section: "매장 분석",
    roles: ["store_owner", "hq_admin"],
    items: [
      { to: "/analytics", label: "매출 현황", icon: chartIcon },
      { to: "/sales/metrics", label: "손익 분석", icon: balanceIcon },
      { to: "/analytics/market", label: "상권 분석", icon: mapIcon },
    ],
  },
];

export const routeDescriptions: Record<string, string> = {
  "/": "점주 또는 본사 역할을 선택합니다.",
  "/dashboard": "오늘 매장 운영 현황을 한눈에 확인합니다.",
  "/production": "지금 생산해야 할 품목과 재고 예측을 확인합니다.",
  "/production/status": "지금 생산해야 할 품목과 재고 예측을 확인합니다.",
  "/production/waste-loss": "폐기 손실 추이와 원인을 확인합니다.",
  "/production/inventory-diagnosis": "품목별 재고 수준을 진단합니다.",
  "/ordering": "주문 누락 방지를 위한 주문 추천안을 비교합니다.",
  "/ordering/recommendations": "주문 누락 방지를 위한 주문 추천안을 비교합니다.",
  "/ordering/history": "최근 발주 이력을 조회합니다.",
  "/sales": "순이익, 손익분기점, 매장 맞춤형 분석을 확인합니다.",
  "/sales/metrics": "순이익, 손익분기점, 매장 맞춤형 분석을 확인합니다.",
  "/analytics": "매출 데이터를 조회합니다.",
  "/analytics/market": "우리 매장 상권 특성과 주요 고객 유형을 확인합니다.",
  "/settings": "배포된 Agent 현황과 시스템 설정을 통합 관리합니다.",
  "/settings/orchestration": "멀티 에이전트 라우팅 파이프라인과 핸드오프 규칙을 관리합니다.",
  "/settings/connectors": "데이터 커넥터 상태와 스키마 동기화를 점검합니다.",
  "/settings/access": "역할 기반 접근 통제와 멤버 권한을 관리합니다.",
  "/settings/prompts": "도메인별 AI 프롬프트를 관리합니다.",
  "/settings/golden-queries": "자주 쓰는 질의를 관리합니다.",
  "/settings/audit-logs": "질의 처리 경로와 차단 이력을 추적합니다.",
  "/settings/quality-archive": "Agent별 품질 검증 이슈를 보관합니다.",
  "/settings/notices": "시스템 운영 공지를 관리합니다.",
};
