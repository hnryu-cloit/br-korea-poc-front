import type {
  FloatingAiCardContext,
  FloatingAiCardContextKey,
} from "@/commons/types/floating-ai-chat";

export const floatingAiCardContexts: Record<FloatingAiCardContextKey, FloatingAiCardContext> = {
  "production:stock-risk": {
    contextKey: "production:stock-risk",
    cardTitle: "생산 재고 현황",
    quickActions: [
      { label: "소진 위험 품목", prompt: "오늘 소진 위험 품목이 있나요?" },
      { label: "추가 생산 필요", prompt: "주말 대비 추가 생산이 필요한 항목은?" },
      { label: "지금 뭐부터?", prompt: "지금 당장 뭐부터 만들어야 해?" },
    ],
  },
  "production:inventory-status": {
    contextKey: "production:inventory-status",
    cardTitle: "재고 수준 진단",
    quickActions: [
      { label: "부족 품목 확인", prompt: "재고 부족 품목은 얼마나 빨리 채워야 해?" },
      { label: "과잉 품목 대응", prompt: "재고 과잉 품목은 어떻게 처리하면 좋아?" },
      { label: "적정 수준은?", prompt: "적정 재고 기준은 어떻게 잡는 게 좋아?" },
    ],
  },
  "production:waste": {
    contextKey: "production:waste",
    cardTitle: "폐기 손실 현황",
    quickActions: [
      { label: "폐기 원인 분석", prompt: "폐기가 많은 품목의 공통점이 있나요?" },
      { label: "폐기 줄이려면?", prompt: "폐기를 줄이려면 어떻게 해야 하나요?" },
      { label: "손실 규모", prompt: "이번 달 폐기 손실이 매출 대비 어느 정도야?" },
    ],
  },
  "ordering:options": {
    contextKey: "ordering:options",
    cardTitle: "주문 추천안 비교",
    quickActions: [
      { label: "안전한 옵션은?", prompt: "이번 주문에서 가장 안전한 옵션은 어떤 건가요?" },
      { label: "지난달 패턴 비교", prompt: "지난달 주문 패턴과 비교하면 어떤가요?" },
      { label: "캠페인 영향은?", prompt: "이번 주 캠페인이 주문 수량에 영향을 미치나요?" },
    ],
  },
  "ordering:history": {
    contextKey: "ordering:history",
    cardTitle: "발주 이력 관리",
    quickActions: [
      { label: "누락 구간 점검", prompt: "최근 발주 누락이 반복된 시간대가 있나요?" },
      { label: "자동/수동 추이", prompt: "자동 발주와 수동 발주의 최근 추이를 비교해줘." },
      { label: "다음 발주 개선", prompt: "다음 발주에서 줄이거나 늘릴 품목을 추천해줘." },
    ],
  },
  "sales:summary": {
    contextKey: "sales:summary",
    cardTitle: "매출 요약",
    quickActions: [
      { label: "매출 낮은 이유", prompt: "오늘 매출이 지난주 같은 요일보다 낮은 이유가 뭔가요?" },
      { label: "피크 시간대", prompt: "피크 시간대를 분석해줘" },
      { label: "이번 달 전망", prompt: "이번 달 이 페이스면 얼마 남아?" },
    ],
  },
};
