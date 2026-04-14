import type { DashboardCardsResponse } from "@/features/dashboard/types/dashboard";

export const dashboardCardsMock: DashboardCardsResponse = {
  cards: [
    {
      domain: "production",
      title: "생산 현황",
      description: "실시간 재고 및 1시간 후 예측",
      cta_label: "생산관리 상세보기",
      cta_path: "/production",
      prompts: [
        { id: "production-1", label: "지금 생산해야 할 품목은?", prompt: "지금 생산해야 할 품목은?" },
        { id: "production-2", label: "찬스 로스가 뭔가요?", prompt: "찬스 로스가 뭔가요?" },
        { id: "production-3", label: "품절 처리 방법은?", prompt: "품절 처리 방법은?" },
      ],
      highlights: [
        {
          title: "초코 도넛 재고 소진 1시간 전",
          description: "현재 재고 12개 · 지금 생산 시 찬스 로스 18% 감소 가능",
          tone: "danger",
        },
        {
          title: "말차 도넛 소진 속도 빠름",
          description: "평소 대비 30% 빠른 판매 속도 감지",
          tone: "warning",
        },
      ],
      metrics: [
        { label: "품절 위험", value: "3개", tone: "danger" },
        { label: "찬스 로스 절감", value: "23%", tone: "primary" },
      ],
    },
    {
      domain: "ordering",
      title: "주문 관리",
      description: "주문 누락 방지 및 추천 검토",
      cta_label: "주문 검토하기",
      cta_path: "/ordering",
      prompts: [
        { id: "ordering-1", label: "추천 주문량은?", prompt: "추천 주문량은?" },
        { id: "ordering-2", label: "어제와 비교하면?", prompt: "어제와 비교하면?" },
        { id: "ordering-3", label: "날씨 영향은?", prompt: "날씨 영향은?" },
      ],
      highlights: [
        {
          title: "주문 마감 임박",
          description: "17분 남음 · AI 추천안 3개 준비됨",
          tone: "warning",
        },
        {
          title: "주문 누락 방지가 목적입니다",
          description: "최종 결정은 점주님이 하십니다.",
          tone: "info",
        },
      ],
      metrics: [
        { label: "주문 상태", value: "검토 필요", tone: "default" },
        { label: "AI 추천안", value: "3개 준비됨", tone: "primary" },
        { label: "추천 기준", value: "전일 / 전주 / 패턴", tone: "default" },
      ],
    },
    {
      domain: "sales",
      title: "손익 분석",
      description: "순이익 및 손익분기점 분석",
      cta_label: "손익분석 상세보기",
      cta_path: "/sales",
      prompts: [
        { id: "sales-1", label: "오늘 순이익은?", prompt: "오늘 순이익은?" },
        { id: "sales-2", label: "손익분기점은?", prompt: "손익분기점은?" },
        { id: "sales-3", label: "어제와 비교하면?", prompt: "어제와 비교하면?" },
      ],
      highlights: [
        {
          title: "오늘 순이익",
          description: "+342,000원 · 순이익률 18.5%",
          tone: "success",
        },
        {
          title: "손익분기점 달성 · +230,000원 초과",
          description: "매장 운영 패턴과 최근 성과를 반영한 답변을 제공합니다.",
          tone: "info",
        },
      ],
      metrics: [
        { label: "매출", value: "1,850,000원", tone: "default" },
        { label: "원가", value: "-890,000원", tone: "danger" },
        { label: "인건비", value: "-520,000원", tone: "danger" },
        { label: "기타 비용", value: "-98,000원", tone: "danger" },
      ],
    },
  ],
};
