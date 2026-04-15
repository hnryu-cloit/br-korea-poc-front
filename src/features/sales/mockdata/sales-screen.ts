import type {
  SalesProductDataItem,
  SalesQueryHistoryItem,
  SalesWeeklyDataItem,
} from "@/features/sales/types/sales-screen";

export const suggestedQuestions = [
  "오늘 순이익은 얼마인가요?",
  "손익분기점까지 얼마나 남았나요?",
  "어제와 비교하면 어떤가요?",
  "이번 주 매출 추이는?",
  "가장 많이 팔린 상품은?",
  "원가율이 높은 품목은?",
  "인건비 비중은 적정한가요?",
  "날씨가 매출에 영향을 주었나요?",
  "작년 같은 기간과 비교하면?",
  "손익을 개선하려면?",
  "우리 매장 특성에 맞는 개선 방법은?",
  "직영점과 비교하면 어떤가요?",
];

export const quickQuestions = [
  "오늘 순이익은?",
  "손익분기점은?",
  "개선 방법은?",
  "우리 매장 특성은?",
];

export const weeklyData: SalesWeeklyDataItem[] = [
  { day: "월", revenue: 1850000, profit: 342000, cost: 1508000 },
  { day: "화", revenue: 2100000, profit: 420000, cost: 1680000 },
  { day: "수", revenue: 1950000, profit: 380000, cost: 1570000 },
  { day: "목", revenue: 2300000, profit: 510000, cost: 1790000 },
  { day: "금", revenue: 2800000, profit: 680000, cost: 2120000 },
  { day: "토", revenue: 3200000, profit: 850000, cost: 2350000 },
  { day: "일", revenue: 2900000, profit: 720000, cost: 2180000 },
];

export const productData: SalesProductDataItem[] = [
  { name: "초코 도넛", sales: 450000, profit: 85000, profitRate: 18.9 },
  { name: "딸기 도넛", sales: 380000, profit: 72000, profitRate: 18.9 },
  { name: "글레이즈드 도넛", sales: 520000, profit: 98000, profitRate: 18.8 },
  { name: "크림 도넛", sales: 320000, profit: 60000, profitRate: 18.8 },
  { name: "말차 도넛", sales: 280000, profit: 50000, profitRate: 17.9 },
];

export function createMockSalesQueryHistoryItem(query: string): SalesQueryHistoryItem {
  return {
    query,
    answer: `강남점의 최근 4주 운영 패턴과 비용 구조를 기준으로 분석한 결과입니다. "${query}"에 대해 현재는 목업 응답을 보여주고 있으며, 실제 연동 시에는 매장 실데이터와 비교군 기준을 반영해 답변합니다.`,
    insights: [
      "강남점 특성상 주말 매출이 평일 대비 40% 높으므로 금요일 오후 생산량을 선반영하세요.",
      "초코 도넛 순이익률이 18.9%로 가장 높습니다. 상단 노출 비중 확대가 유효합니다.",
      "말차 도넛 원가율이 높아 레시피 또는 프로모션 구조 조정이 필요합니다.",
    ],
    storeContext: "강남점 · 최근 4주 운영 패턴 기준",
    dataSource: "POS 데이터, 재고 데이터, 주문 이력",
    comparisonBasis: "전주 동요일, 직영점 평균",
    calculationDate: "2026-04-06 기준",
  };
}
