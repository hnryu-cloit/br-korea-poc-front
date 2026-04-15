import type { FloatingAiChatRouteGuide } from "@/commons/types/floating-ai-chat";

export const floatingAiChatRouteGuides: Record<string, FloatingAiChatRouteGuide> = {
  "/": {
    title: "통합 운영 해설",
    subtitle: "현재 화면의 핵심 리스크와 바로 해야 할 조치를 요약합니다.",
    quickActions: [
      { label: "품절 위험", prompt: "지금 가장 먼저 대응해야 할 품절 위험을 알려줘" },
      { label: "주문 검토", prompt: "주문 마감 전에 꼭 봐야 할 포인트를 정리해줘" },
      { label: "분석 요약", prompt: "오늘 매출 분석에서 바로 실행할 인사이트를 알려줘" },
    ],
  },
  "/analytics": {
    title: "질의형 분석 해설",
    subtitle: "SQL/API 우선 처리 경로와 LLM 호출 최소화 구조를 설명합니다.",
    quickActions: [
      { label: "라우팅 설명", prompt: "이 질의가 왜 SQL 우선 처리되는지 설명해줘" },
      { label: "토큰 절감", prompt: "LLM 토큰 사용량을 줄이는 방법을 알려줘" },
      { label: "분석 구조", prompt: "RAG 출처 응답 구조를 짧게 설명해줘" },
    ],
  },
  "/hq/coaching": {
    title: "주문 코칭 해설",
    subtitle: "미완료 매장 대응과 코칭 포인트를 정리합니다.",
    quickActions: [
      { label: "미완료 대응", prompt: "주문 미완료 매장에 어떻게 대응해야 하는지 알려줘" },
      { label: "옵션 코칭", prompt: "전월 동요일 선택 시 주의할 점을 설명해줘" },
      { label: "알림 발송", prompt: "긴급 알림 발송 기준과 내용을 알려줘" },
    ],
  },
  "/hq/inspection": {
    title: "생산 점검 해설",
    subtitle: "준수율 낮은 매장 개선 방법과 코칭 포인트를 정리합니다.",
    quickActions: [
      { label: "개선 방안", prompt: "생산 알림 미대응 매장 개선 방법을 알려줘" },
      { label: "찬스 로스", prompt: "찬스 로스가 높은 매장의 원인을 분석해줘" },
      { label: "방문 점검", prompt: "본사 현장 방문 점검 체크리스트를 알려줘" },
    ],
  },
  "/signals": {
    title: "매출 시그널 해설",
    subtitle: "긴급 시그널 우선순위와 본사 개입 기준을 설명합니다.",
    quickActions: [
      { label: "긴급 대응", prompt: "긴급 시그널 중 가장 먼저 대응해야 할 것은?" },
      { label: "배달 감소", prompt: "배달 급감 시그널에 본사가 할 수 있는 조치를 알려줘" },
      { label: "리타겟팅", prompt: "T-day 재방문율 시그널을 마케팅에 활용하는 방법은?" },
    ],
  },
  "/production": {
    title: "생산 관리 해설",
    subtitle: "예측 재고, 생산 패턴, 알림 시점을 함께 보고 대응 우선순위를 정리합니다.",
    quickActions: [
      { label: "왜 위험한가", prompt: "어떤 SKU가 왜 1시간 내 품절 위험인지 설명해줘" },
      { label: "생산 시점", prompt: "지금 생산 등록이 필요한 시점을 추천해줘" },
      { label: "찬스 로스", prompt: "생산 타이밍을 놓치면 찬스 로스가 얼마나 생기는지 알려줘" },
    ],
  },
  "/ordering": {
    title: "주문 관리 해설",
    subtitle: "3개 옵션과 특이사항을 비교하고 점주 선택 근거를 정리합니다.",
    quickActions: [
      { label: "추천 옵션", prompt: "지금 3개 주문 옵션 중 어떤 안을 추천하는지 말해줘" },
      { label: "특이사항", prompt: "캠페인이나 이상치 때문에 주의할 점을 알려줘" },
      { label: "선택 사유", prompt: "점주가 입력할 선택 사유 예시를 작성해줘" },
    ],
  },
  "/sales": {
    title: "매출 분석 해설",
    subtitle: "자연어 질의 결과를 액션 중심으로 요약해 보여줍니다.",
    quickActions: [
      { label: "배달 감소", prompt: "배달 건수 감소 원인과 대응 액션을 알려줘" },
      { label: "상품 전략", prompt: "상품 믹스를 개선할 수 있는 실행안을 제안해줘" },
      { label: "보고용 한 줄", prompt: "점주에게 보여줄 요약 문장을 한 줄로 만들어줘" },
    ],
  },
  "/orchestration": {
    title: "보안 정책 해설",
    subtitle: "질의 라우팅, 민감정보 보호, 감사 로그 기준을 화면 문맥으로 해설합니다.",
    quickActions: [
      { label: "라우팅 설명", prompt: "이 질의는 왜 SQL/API 우선 처리가 맞는지 설명해줘" },
      { label: "마스킹 기준", prompt: "현재 화면에서 마스킹해야 할 민감정보를 정리해줘" },
      { label: "출처 응답", prompt: "RAG 출처 응답 구조를 짧게 설명해줘" },
    ],
  },
};
